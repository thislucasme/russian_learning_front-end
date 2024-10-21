import { Avatar, Button, HStack, Input, InputGroup, InputRightElement, position, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react"
import { Space } from "antd"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateFlashcardTdo } from "../tdo/createflashcardTdo";
import { flashcardsApi, updateFlashcardsApi } from "../api/api";
import { NoCardsToReview } from "../components/NoCardsToReview";

export const FlashCards = () => {

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loadingFlashcards, setLoadingFlashcards] = useState<boolean>(false);
    const [currentPosition, setCurrentPosition] = useState<number>(0)
    const [showBackCard, setShowBackCard] = useState<boolean>(false)

    const navigate = useNavigate();
    const [cards, setCards] = useState<CreateFlashcardTdo[]>([])

    const [flashcardReviewed, setFlashcardReviewed] = useState<CreateFlashcardTdo>()


    async function getFlashcards() {
        setLoadingFlashcards(true)
        try {
            const flashcardsResponse = await flashcardsApi();
            setCards(flashcardsResponse)
            console.log("flashcards fetch sucessfully");
            console.log(flashcardsResponse)
            
        } catch (error: any) {
            setLoadingFlashcards(false)
            setErrorMessage(error.response?.data?.message || "Error loading flashcards.");
        }

    }

    async function updateFlashcard(rating: number) {
     console.log(cards[currentPosition])
        try {
            const flashcardUpdatedResponse = await updateFlashcardsApi(cards[currentPosition], rating);
            setFlashcardReviewed(flashcardUpdatedResponse)
            console.log("flashcards updated sucessfully");
            console.log(flashcardUpdatedResponse)
            
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || "Error updating flashcards.");
        }

    }

    useEffect(() => {
        getFlashcards()
    }, [flashcardReviewed])


    useEffect(() => {
        console.log(cards)
    }, [cards])

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
                    <Text fontWeight={"semibold"} fontSize={"x-large"}>Flashcards</Text>
                    <VStack w={"full"}>
                       {cards?.length <= 0 ? <NoCardsToReview/>
                       : <>
                        <VStack borderRadius={5} align={"center"} p={2}>
                        <Text fontWeight={"semibold"}>{cards[currentPosition]?.front}</Text>
                            {showBackCard ? <Text fontWeight={"semibold"}>{cards[0].back}</Text> : <></>}
                            
                            <Button onClick={()=>{setShowBackCard(!showBackCard)}}>{showBackCard ? "Hiden": "Show"} the back card</Button>
                        </VStack>
                        <VStack mt={10}>
                            <Wrap spacing={4}>
                            <WrapItem>
                                    <Button onClick={()=>{updateFlashcard(5)}} colorScheme='green'>Perferct</Button>
                                </WrapItem>
                                <WrapItem>
                                    <Button onClick={()=>{updateFlashcard(4)}}  colorScheme='yellow'>Hesitation</Button>
                                </WrapItem>
                                <WrapItem>
                                    <Button onClick={()=>{updateFlashcard(2)}}  colorScheme='orange'>Dificulty</Button>
                                </WrapItem>
                                <WrapItem>
                                    <Button onClick={()=>{updateFlashcard(1)}}  colorScheme='red'>Backout</Button>
                                </WrapItem>
                                
                            </Wrap>
                        </VStack>
                       </>}
                    </VStack>
                </VStack>
                <HStack>

                </HStack>

            </VStack>
        </VStack>
    </>)
}