import axios from 'axios';
import { CreateMessageTdo } from '../tdo/messageTdo';
import { CreateFlashcardTdo } from '../tdo/createflashcardTdo';

const api = axios.create({
    baseURL: 'http://localhost:3066',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('acess_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export const login = async (email: string, senha: string) => {
    try {
        const response = await api.post('login', {
            email: email,
            password: senha
        });

        const { acess_token } = response.data;
        localStorage.setItem('acess_token', acess_token);

        return acess_token;
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        throw error;
    }
};

export const createConversationApi = async () => {
    try {
        const response = await api.post('conversation', {
            title: "Algum título aqui"
        });

        const { data } = response;

        return data;
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw error;
    }
};
export const messagesApi = async (conversationId : string) => {
    try {
        const response = await api.get(`message`, {params: {conversationId: conversationId}});

        const { data } = response;
        return data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

export const flashcardsApi = async () => {
    try {
        const response = await api.get(`flashcard`);

        const { data } = response;
        return data;
    } catch (error) {
        console.error('Error fetching flashcard:', error);
        throw error;
    }
};
export const countFlashcardsApi = async () => {
    try {
        const response = await api.get(`flashcard/count`);

        const { data } = response;
        return data;
    } catch (error) {
        console.error('Error fetching counting:', error);
        throw error;
    }
};

export const fetchTtsAudio = async (idMessage: string, text: string): Promise<Blob> => {
    try {
      const response = await api.get(`/tts/`, {
        responseType: 'blob',
        params:{idMessage: idMessage, text: text}
      });
  
      return response.data; 
    } catch (error) {
      console.error('Error fetching TTS audio:', error);
      throw error;
    }
  };

export const updateFlashcardsApi = async (flashcard: CreateFlashcardTdo, grade : number) => {

    const body = {
        interval: flashcard.interval,
        repetition: flashcard.repetition,
        efactor: flashcard.efactor,
        dueDate: flashcard.dueDate,
        id:flashcard._id
    }
 
    try {
        const response = await api.post(`flashcard/update`, body, {params: {grade: grade}});

        const { data } = response;
        return data;
    } catch (error) {
        console.error('Error fetching counting:', error);
        throw error;
    }
};
export const createMessageApi = async (createMessageTdo : CreateMessageTdo) => {
    try {
        const response = await api.post(`message`, createMessageTdo);
        const { data } = response;
        return data?.message;
    } catch (error) {
        console.error('Error creating messages:', error);
        throw error;
    }
};



