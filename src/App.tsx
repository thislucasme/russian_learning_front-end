import {
  ChakraProvider,
  theme
} from "@chakra-ui/react"
import Home from "./page/Home"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PropostasPage from "./page/Proposta";
import Efetivacoes from "./page/PropostasByAnalista";

import { Chat } from "./page/Chat";
import { FlashCards } from "./page/FlashCards";
import { Conversations } from "./page/Conversations";
import { Login } from "./page/Login";
import { StartFlashcards } from "./page/StartFlashcards";

export const App = () => (
<ChakraProvider theme={theme}>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/flashcards" element={<FlashCards />} />
        <Route path="/start-flashcards" element={<StartFlashcards />} />
        <Route path="/login" element={<Login />} />
        <Route path="/conversations" element={<Conversations />} />
        <Route path="/efetivacoes/:idAnalista" element={<Efetivacoes />} />
        <Route path="/propostas" element={<PropostasPage />} />
      </Routes>
    </Router>
  </ChakraProvider>
)
