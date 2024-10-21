import { Alert, AlertDescription, AlertIcon, AlertTitle, Avatar, Button, HStack, Input, InputGroup, InputRightElement, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react"
import { login } from "../api/api"
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export const Login = () => {

    const [email, setEmail] = useState<string>("");
    const [senha, setSenha] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    async function logIn() {
        setLoading(true)
        try {
            const token = await login(email, senha);
            console.log("Login bem-sucedido, token:", token);
            setLoading(false)
            setErrorMessage(null);  // Limpa a mensagem de erro em caso de sucesso
            navigate("/chat")
        } catch (error: any) {
            setLoading(false)
            setErrorMessage(error.response?.data?.message || "Erro ao realizar o login.");
        }
        
    }
    return (<>
        <VStack
            width="100vw"
            height="100vh"
            justify="center"
            align="center"
            spacing={4}
            bg="white"
        >
            <VStack
                width={400}
                height="100vh"
                align="center"
                spacing={2}
                borderRadius={10}
                bg="white"
                m={10} // Margem de 20 unidades
            >
                <VStack align={"start"} w={"full"} h={100}>
                    <VStack w={"full"}>
                        <VStack mt={20}>
                            <Text fontWeight={"bold"} fontSize={"x-large"}>Login</Text>
                            {errorMessage && (
                                <Alert status="error" w="full">
                                    <AlertIcon />
                                    <AlertTitle mr={2}>Erro</AlertTitle>
                                    <AlertDescription>{errorMessage}</AlertDescription>
                                </Alert>
                            )}
                            <Input
                            onChange={(e)=> {setEmail(e.target.value)}}
                            value={email}
                                w={"full"}
                                pr='4.5rem'
                                bg={"gray.100"}
                                placeholder='Email'
                            />
                            <Input
                             onChange={(e)=> {setSenha(e.target.value)}}
                             value={senha}
                                w={"full"}
                                pr='4.5rem'
                                bg={"gray.100"}
                                type="password"
                                placeholder='Senha'
                            />
                            <Button isLoading={loading} onClick={logIn} w={"full"} colorScheme='purple'>Entrar</Button>
                        </VStack>
                    </VStack>
                </VStack>
                <HStack>

                </HStack>

            </VStack>
        </VStack>
    </>)
}