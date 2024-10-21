import { Avatar, Button, HStack, Input, InputGroup, InputRightElement, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react"
import { Space } from "antd"
import { CardConversation } from "../components/CardConversas"

export const Conversations = () => {
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
                   
                        <Button colorScheme='purple' variant='solid'>
                            Conversations
                        </Button>
                        <Button colorScheme='purple' variant='link'>
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
                    <Text fontWeight={"semibold"} fontSize={"x-large"}>Conversations History</Text>
        <CardConversation/>
                </VStack>
                <HStack>

                </HStack>

            </VStack>
        </VStack>
    </>)
}