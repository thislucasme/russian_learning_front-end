import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Card,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Image,
  Button,
  Spinner,
  Text,
  HStack,
  VStack
} from '@chakra-ui/react';
import axios from 'axios';
import { Table, Tag, Space } from 'antd';
import 'antd/dist/reset.css'; // Certifique-se de importar o CSS do Ant Design

// Tipo para dados de consultores
interface Consultant {
  nome_consultor: string;
  quantidade_efetivacoes: number;
  soma_total_premios: number;
  media_premio: number;
  id: number;
}

// Função para calcular o total e a média dos prêmios
const calculatePrizeStats = (total: number, quantity: number) => {
  const average = quantity > 0 ? total / quantity : 0;
  return { total, average };
};

// Função para formatar a data no formato YYYY/MM/DD
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês é zero-indexado
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

// Função para formatar valores em reais
const formatarParaReais = (valor: number) => {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const ConsultantsPage: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [meta, setMeta] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Configura as datas iniciais
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    setStartDate(formatDate(sevenDaysAgo)); // Formato YYYY/MM/DD
    setEndDate(formatDate(today)); // Formato YYYY/MM/DD
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.post('http://localhost:3000/api/propostas_efetivadas/get', {
            startDate: startDate,
            endDate: endDate
          });
          setConsultants(response.data.efetivacoes);
          setMeta(response.data.meta); // Corrige o acesso ao array de consultores
        } catch (error) {
          setError('Erro ao buscar dados. Tente novamente mais tarde.');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [startDate, endDate]);

  // Cálculo dos totais e médias
  const totalEfetivacoes = consultants.reduce((acc, cur) => acc + cur.quantidade_efetivacoes, 0);
  const totalPremios = consultants.reduce((acc, cur) => acc + cur.soma_total_premios, 0);

  // Dados para a tabela do Ant Design
  const dataSource = consultants.map(consultant => {
    const { total, average } = calculatePrizeStats(consultant.soma_total_premios, consultant.quantidade_efetivacoes);
    return {
      key: consultant.id,
      nome: consultant.nome_consultor,
      quantidade: consultant.quantidade_efetivacoes,
      somaTotal: formatarParaReais(total),
      mediaPremio: formatarParaReais(average)
    };
  });

  const handleRowClick = (id: number) => {
    console.log('ID da proposta:', id);
    const url = `http://localhost:3001/efetivacoes/${id}`;
    window.open(url, '_blank'); // Abre o link em uma nova aba
  };

  return (
    <Container maxW="container.lg" mt={2} borderRadius={20}>
      {/* Logo */}
      <HStack justify="space-between" w="100%" mb={3}>
        <Box>
          <Image src="https://terrafertil.corretor-online.com.br/ControlesDev/GetLogoCor.Aspx?corretora=TERRAFERTIL&supervisor=true" alt="Logo" boxSize="150px" objectFit="contain" />
        </Box>
        <HStack spacing={8}>
          <Box color={"gray.600"} as="a" href="/efetivacoes" fontWeight="bold">
            Efetivações
          </Box>
          <Box color={"gray.600"} as="a" href="/propostas" fontWeight="bold">
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
            value={startDate.replace(/\//g, '-')} // Converte YYYY/MM/DD para YYYY-MM-DD
            onChange={(e: ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value.replace(/-/g, '/'))} // Converte YYYY-MM-DD para YYYY/MM/DD
            placeholder="Data de Início"
          />
          <Input
            bg="white"
            type="date"
            value={endDate.replace(/\//g, '-')} // Converte YYYY/MM/DD para YYYY-MM-DD
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value.replace(/-/g, '/'))} // Converte YYYY-MM-DD para YYYY/MM/DD
            placeholder="Data de Fim"
          />
          <Button px={10} colorScheme="green" bg="#00b94f" onClick={() => {
            if (startDate && endDate) {
              // Recarrega os dados quando o filtro é aplicado
              const fetchData = async () => {
                setLoading(true);
                setError(null);
                try {
                  const response = await axios.post('http://localhost:3000/api/propostas_efetivadas/get', {
                    startDate: startDate,
                    endDate: endDate
                  });
                  setConsultants(response.data.efetivacoes); // Corrige o acesso ao array de consultores
                } catch (error) {
                  setError('Erro ao buscar dados. Tente novamente mais tarde.');
                } finally {
                  setLoading(false);
                }
              };
              fetchData();
            }
          }}>Aplicar</Button>
        </HStack>
      </FormControl>

      {/* Cards de Meta */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card h={130} p={6} shadow="md" borderRadius="lg" textAlign="center" bg="linear-gradient(to left, #00b94f, #007a35)">
          <Heading size="md" color="white">Total Efetivações</Heading>
          <Heading m={4} size="lg" color="white">{totalEfetivacoes}</Heading>
        </Card>

        <Card h={130} p={6} shadow="md" borderRadius="lg" textAlign="center" bg="linear-gradient(to left, #929292, #595959)">
          <Heading size="md" color="white">Total Prêmios</Heading>
          <Heading m={5} size="md" color="white">{formatarParaReais(Number(totalPremios))}</Heading>
        </Card>

        <Card h={130} p={6} shadow="md" borderRadius="lg" textAlign="center" bg="linear-gradient(to left, #00b94f, #007a35)">
          <Heading size="md" color="white">Meta</Heading>
          <Heading m={5} size="md" color="white"> {formatarParaReais(Number(meta))}</Heading>
        </Card>
      </SimpleGrid>

      {/* Mensagem de erro ou carregamento */}
      {loading && <Box textAlign="center" mb={4}><Spinner size="lg" color="#00b94f" /></Box>}
      {error && <Text color="red.500" textAlign="center">{error}</Text>}

      {/* Tabela de Consultores */}
      <Heading as="h2" mb={4} color="#00b94f">Consultores</Heading>
      <Box bg={"white"}>
        <Table
          dataSource={dataSource}
          onRow={(record) => ({
            onClick: () => handleRowClick(record.key as number),
          })}
          pagination={false}
          bordered
        >
          <Table.Column title="Nome" dataIndex="nome" key="nome" />
          <Table.Column title="Quantidade" dataIndex="quantidade" key="quantidade" />
          <Table.Column
            title="Soma Total"
            dataIndex="somaTotal"
            key="somaTotal"
            render={(text) => <Tag color="success">{text}</Tag>}
          />
          <Table.Column title="Média do Prêmio" dataIndex="mediaPremio" key="mediaPremio" />
        </Table>
      </Box>
    </Container>
  );
};

export default ConsultantsPage;
