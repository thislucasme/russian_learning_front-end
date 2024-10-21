import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Box,
  Container,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Image,
  Spinner,
  Text,
  Heading
} from '@chakra-ui/react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Table, Tag } from 'antd';
import 'antd/dist/reset.css'; // Importa o CSS do Ant Design

interface Proposal {
  id: number;
  name: string;
  email: string;
  phone1: string;
  phone2: string;
  operationCode: string;
  paymentMethod: string;
  installments: string;
  contractType: string;
  insuranceType: string;
  analystName: string;
  productionGroup: string;
  creationDate: string;
}

const Propostas: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const today = new Date();
    const todayFormatted = formatDate(today);
    setStartDate(todayFormatted);
    setEndDate(todayFormatted);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `http://localhost:3000/api/propostas?startDate=${startDate}&endDate=${endDate}`
          );
          setProposals(response.data);
        } catch (error) {
          console.error('Error fetching proposals:', error);
          setError('Erro ao buscar propostas. Tente novamente mais tarde.');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [startDate, endDate]);

  const handleDownload = () => {
    const wb = XLSX.utils.book_new();
    const ws_data = proposals.map((proposta) => ({
      PI: null,
      SEGURADORA: null,
      TIPO: proposta.contractType || '',
      SEGURADO: proposta.name || '',
      CONSULTOR: proposta.analystName || '',
      DATA: proposta.creationDate || '',
      COMISSAO: proposta.operationCode || '',
      STATUS: null,
      LOJA: proposta.productionGroup || '',
    }));

    const ws = XLSX.utils.json_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Propostas');

    // Escreve o arquivo
    XLSX.writeFile(wb, 'propostas.xlsx');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tipo',
      dataIndex: 'contractType',
      key: 'contractType',
    },
    {
      title: 'Consultor',
      dataIndex: 'analystName',
      key: 'analystName',
      render: (text: string) => text.toUpperCase(),
    },
    {
      title: 'Loja',
      dataIndex: 'productionGroup',
      key: 'productionGroup',
    },
    {
      title: 'Comissão',
      dataIndex: 'operationCode',
      key: 'operationCode',
      render: (text: string) => `${text}%`,
    },
    {
      title: 'Data de Criação',
      dataIndex: 'creationDate',
      key: 'creationDate',
    },
  ];

  return (
    <Container maxW="container.lg" mt={2} borderRadius={20}>
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
          <Box as="a" href="/" fontWeight="bold">
            Efetivações
          </Box>
          <Box color={"#00b94f"} as="a" href="/propostas" fontWeight="bold">
            Propostas
          </Box>
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
            onClick={() => {
              const fetchData = async () => {
                setLoading(true);
                setError(null);
                try {
                  const response = await axios.get(
                    `http://localhost:3000/api/propostas?startDate=${startDate}&endDate=${endDate}`
                  );
                  setProposals(response.data);
                } catch (error) {
                  console.error('Error fetching proposals:', error);
                  setError('Erro ao buscar propostas. Tente novamente mais tarde.');
                } finally {
                  setLoading(false);
                }
              };
              fetchData();
            }}
          >
            Aplicar
          </Button>
        </HStack>
      </FormControl>

      {loading && <Box textAlign="center" mb={4}><Spinner size="lg" color="#00b94f" /></Box>}
      {error && <Text color="red.500" textAlign="center">{error}</Text>}

      <HStack mb={4}>
        <Heading as="h2" mb={4} color="#00b94f">Propostas</Heading>
        <Button variant={"ghost"} colorScheme="green" ml="auto" onClick={handleDownload}>Download</Button>
      </HStack>

      <Table
        columns={columns}
        dataSource={proposals}
        rowKey="id"
        bordered
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </Container>
  );
};

export default Propostas;
