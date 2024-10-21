import { Avatar, Button, HStack, Input, InputGroup, InputRightElement, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react"
import { Space } from "antd"
import { countFlashcardsApi } from "../api/api";
import { useEffect, useState } from "react";
import { CountingCardsTdo } from "../tdo/countingCardsTdo";
import { useNavigate } from "react-router-dom";

export const StartFlashcards = () => {

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const [totalCards, setTotalCards] = useState<CountingCardsTdo>({})

    async function getMessages() {
        setLoading(true)
        try {
            const countingCardsResponse = await countFlashcardsApi();
            setTotalCards(countingCardsResponse)
            console.log("Counting fetch sucessfully");
            console.log(countingCardsResponse)
            
        } catch (error: any) {
            setLoading(false)
            setErrorMessage(error.response?.data?.message || "Error loading counting.");
        }

    }

    useEffect(() => {
        getMessages()
    }, [])


    useEffect(() => {
    }, [totalCards])

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
                    <Text fontWeight={"semibold"}>Russian Language Learning</Text>
                    <HStack spacing={10}>
                        <Button colorScheme='purple' variant='link'>
                            Conversations
                        </Button>
                        <Button colorScheme='purple' variant='solid'>
                            Review
                        </Button>
                        <Button colorScheme='purple' variant='link'>
                            Chatting with AI
                        </Button>

                        <WrapItem>
                            <Avatar size='sm' name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
                        </WrapItem>
                    </HStack>

                </HStack>
                <VStack align={"start"} w={"80%"} h={100}>
                    <Text fontWeight={"semibold"} fontSize={"x-large"}>Review Flashcard</Text>
                    <VStack w={"full"}>
                        <HStack spacing={5} borderRadius={5} align={"center"} >
                            <VStack>
                            <Text fontSize={"x-large"} color={"green"} fontWeight={"semibold"}>{totalCards.newCards}</Text>
                            <Text fontSize={"small"} color={"gray"}>New</Text>
                            </VStack>
                            <VStack>
                            <Text fontSize={"x-large"} color={"red"} fontWeight={"semibold"}>{totalCards.toReview}</Text>
                            <Text fontSize={"small"} color={"gray"}>To review</Text>
                            </VStack>
                        </HStack>
                        <VStack mt={20}>
                            <Wrap spacing={4}>
                            <WrapItem>
                                    <Button colorScheme='green' onClick={()=>{navigate("/flashcards")}}>Start</Button>
                                </WrapItem>
                            </Wrap>
                        </VStack>
                    </VStack>
                </VStack>
                <HStack>

                </HStack>

            </VStack>
        </VStack>
    </>)
}