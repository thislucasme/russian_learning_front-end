import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Box,
  Container,
  HStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Spinner,
  Text,
  Image
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Tag } from 'antd';
import 'antd/dist/reset.css'; // Importa o CSS do Ant Design

interface Efetivacao {
  id: number;
  idDoAnalista: number;
  valorPremio: number;
  data: string;
  loja: string;
}

interface Analista {
  nome: string;
}

const Efetivacoes: React.FC = () => {
  const { idAnalista } = useParams<{ idAnalista: string }>(); // Captura o idDoAnalista da URL
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [efetivacoes, setEfetivacoes] = useState<Efetivacao[]>([]);
  const [analista, setAnalista] = useState<Analista | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatarParaReais = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  useEffect(() => {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7); // Define a data inicial como uma semana antes

    const todayFormatted = formatDate(today);
    const oneWeekAgoFormatted = formatDate(oneWeekAgo);

    setStartDate(oneWeekAgoFormatted);
    setEndDate(todayFormatted);
  }, []);

  const fetchEfetivacoes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/propostas_efetivadas/byAnalista?idDoAnalista=${idAnalista}&startDate=${startDate}&endDate=${endDate}`
      );
      setEfetivacoes(response.data.efetivacoes);
      setAnalista(response.data.analista[0]);
    } catch (error) {
      console.error('Error fetching efetivações:', error);
      setError('Erro ao buscar efetivações. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEfetivacoes();
  }, [startDate, endDate, idAnalista]); // Atualiza sempre que a data ou o idDoAnalista mudarem

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Loja',
      dataIndex: 'loja',
      key: 'loja',
    },
    {
      title: 'Valor Prêmio',
      dataIndex: 'valorPremio',
      key: 'valorPremio',
      render: (value: number) => (
        <Tag color="success">
          {formatarParaReais(value)}
        </Tag>
      ),
    },
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
    },
  ];

  return (
    <Container maxW="container.lg" mt={5} borderRadius={20}>
      <HStack justify="space-between" w="100%" mb={3}>
        <Box>
          <Image
            src="https://terrafertil.corretor-online.com.br/ControlesDev/GetLogoCor.Aspx?corretora=TERRAFERTIL&supervisor=true"
            alt="Logo"
            boxSize="150px"
            objectFit="contain"
          />
        </Box>
        <HStack spacing={8}>
          <Text mb={4}>
            Efetivações de {analista?.nome || 'Analista'}
          </Text>
        </HStack>
      </HStack>

      <FormControl id="date-range" mb={6}>
        <FormLabel>Filtro por Período</FormLabel>
        <HStack spacing={4} mb={4}>
          <Input
            bg="white"
            type="date"
            value={startDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
            placeholder="Data de Início"
          />
          <Input
            bg="white"
            type="date"
            value={endDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
            placeholder="Data de Fim"
          />
          <Button
            px={10}
            colorScheme="green"
            bg="#00b94f"
            onClick={fetchEfetivacoes}
          >
            Aplicar
          </Button>
        </HStack>
      </FormControl>

      {loading && <Box textAlign="center" mb={4}><Spinner size="lg" color="#00b94f" /></Box>}
      {error && <Text color="red.500" textAlign="center">{error}</Text>}

      <Table
        columns={columns}
        dataSource={efetivacoes}
        rowKey="id"
        bordered
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </Container>
  );
};

export default Efetivacoes;
