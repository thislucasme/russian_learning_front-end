import { Alert, AlertDescription, AlertIcon, AlertTitle, Avatar, Button, HStack, Input, InputGroup, InputRightElement, Text, VStack, WrapItem } from "@chakra-ui/react"
import { Space } from "antd"
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageDisplay from '../components/MessageDisplay';
import { CreateConversationTdo } from "../tdo/createConversationTdo";
import { createConversationApi, createMessageApi, messagesApi } from "../api/api";
import { CreateMessageTdo } from "../tdo/messageTdo";
import { CiPlay1 } from "react-icons/ci";
import '../css/css.css'
import AudioPlayer from "../components/AudioPlayer";

export const Chat = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingCreatingMessage, setLoadingCreatingMessage] = useState<boolean>(false);

    const [conversation, setConversation] = useState<CreateConversationTdo>({})
    const navigate = useNavigate();
    const successMessageRef = useRef<{ showMessage: () => void }>(null);

    const [text, setText] = useState<string>('');

    const [messages, setMessages] = useState<CreateMessageTdo[]>([])

    const messagesEndRef = useRef<HTMLDivElement>(null);

    async function createConversation() {
        setLoading(true)
        try {
            const conversationResponse = await createConversationApi();
            setConversation(conversationResponse)
            console.log("Conversation created sucessfully");
            //console.log(conversationResponse)
            successMessageRef.current?.showMessage()
            setLoading(false)
            setErrorMessage(null);  // Limpa a mensagem de erro em caso de sucesso
        } catch (error: any) {
            setLoading(false)
            setErrorMessage(error.response?.data?.message || "Erro ao criar conversation.");
        }

    }

    async function getMessages(conversationId: string) {
        setLoading(true)
        try {
            const messagesResponse = await messagesApi(conversationId);
            setMessages(messagesResponse)
            console.log("Messages fetch sucessfully");
            console.log(messages)
            
        } catch (error: any) {
            setLoading(false)
            setErrorMessage(error.response?.data?.message || "Error loading messages.");
        }

    }

    async function createMessage() {
        const msg = new CreateMessageTdo()
        msg.conversationId = conversation._id;
        msg.message = text;
        msg.from = conversation.userId

        setLoadingCreatingMessage(true)
        try {
            const messageResponse = await createMessageApi(msg);
            getMessages(conversation?._id || "vazio")
            console.log("Message created");
            setLoadingCreatingMessage(false)
            setText('')
            
        } catch (error: any) {
            setLoadingCreatingMessage(false)
            setErrorMessage(error.response?.data?.message || "Error creating messages.");
            console.error(error)
        }

    }


    useEffect(() => {
        createConversation()

    }, [])


    useEffect(() => {
        console.log(conversation)
        getMessages(conversation?._id || "vazio")
    }, [conversation])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      };

    return (<>
        <VStack
            width="100vw"
            height="100vh"
            justify="center"
            align="center"
            spacing={4}
            bg="#dde6ee"
        >
            <VStack
                width="80vw"
                height="100vh"
                align="center"
                spacing={4}
                borderRadius={10}
                bg="white"
                margin={10} // Margem de 20 unidades
            >
                <HStack borderBottomColor={"gray.100"}
                    borderBottomWidth={1} borderTopRadius={10}
                    w={"full"} h={"70px"} bg={"white"} justify={"space-between"} p={4}>
                    <Text fontWeight={"semibold"}>RU.bot</Text>
                    <HStack spacing={10}>
                        <Button colorScheme='purple' variant='link'>
                            Conversations
                        </Button>
                        <Button colorScheme='purple' variant='link' onClick={()=>{navigate('/start-flashcards')}}>
                            Review
                        </Button>
                        <Button colorScheme='purple' variant='solid'>
                            Chatting with AI
                        </Button>
                        <WrapItem>
                            <Avatar size='sm' name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
                        </WrapItem>
                    </HStack>

                </HStack>
                <VStack align={"start"} w={"80%"} h={"80vh"} >
                    <Text fontWeight={"semibold"} fontSize={"x-large"}>Russian Language Learning</Text>
                    {errorMessage && (
                        <Alert status="error" w="full">
                            <AlertIcon />
                            <AlertTitle mr={2}>Erro</AlertTitle>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}
                    <VStack align={"start"} w={"full"} h={"50vh"} overflowY="auto" className="custom-scrollbar" >
                        {messages?.map((message, index) => (
                            <HStack key={index} borderRadius={5} bg={message.from === conversation.userId ? "gray.100" : "purple.100"} align={"center"} p={2} mb={2}>
                                <Text>{message.message}</Text> {/* Ajuste 'message.text' conforme necessário */}
                               <VStack>
                          {message.from !== conversation.userId ? <AudioPlayer idMessage={message._id} text={message.message}/> : <></>}
                               </VStack>
                            </HStack>
                        ))}
                        <div ref={messagesEndRef} />
                    </VStack>
                    <InputGroup size='md'>
                        <Input
                            onChange={(e)=>{setText(e.target.value)}}
                            value={text}
                            pr='4.5rem'
                            bg={"gray.100"}
                            placeholder='Type your message here...'
                        />
                        <InputRightElement width='4.5rem'>
                            <Button isLoading={loadingCreatingMessage} colorScheme='purple' h='1.75rem' size='sm' onClick={() => { createMessage()}}>
                                Send
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </VStack>
                <HStack>

                </HStack>

            </VStack>
        </VStack>
        <MessageDisplay ref={successMessageRef} type="success" content="Conversation created successfully." />
    </>)
}