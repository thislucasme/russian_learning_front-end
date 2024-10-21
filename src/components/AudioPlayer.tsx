import React, { useEffect, useRef, useState } from 'react';
import { AudioTdo } from '../tdo/audioTdo';
import { fetchTtsAudio } from '../api/api';
import { CiPlay1 } from "react-icons/ci";
import { Button } from '@chakra-ui/react';

const AudioPlayer = ({ idMessage, text }: AudioTdo) => {
    const [audioUrl, setAudioUrl] = useState('');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const cleanupAudio = () => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
    };

    const handlePlay = async () => {
        setLoading(true)
        try {
            const audioBlob = await fetchTtsAudio(idMessage || "", text || "");
            const url = URL.createObjectURL(audioBlob);
            const tmp = new Audio(url);
            tmp.play()
            setLoading(false)
        } catch (error) {
            console.error('Error loading audio:', error);
            setLoading(false)
        }
       
    };
    useEffect(() => {
        return () => {
            cleanupAudio();
        };
    }, []);
    return (
        <div>
           
            <Button isLoading={loading} onClick={handlePlay} ><CiPlay1 /></Button>
        </div>
    );
};

export default AudioPlayer;
