'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  IconButton,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useFuncionarios } from '../../hooks/useFuncionarios';
import { atualizarFuncionario, deletarFuncionario } from '@/services/funcionarios';


export const GerenciarEquipe = () => {
  const {
    funcionarios
  } = useFuncionarios();

  const [nome, setNome] = useState('');
  const [carga, setCarga] = useState(''); // manter string (melhor para input number)
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!nome.trim() || !carga.trim()) {
      toast({
        title: 'Preencha todos os campos',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const cargaMinutos = Number(carga);
    if (Number.isNaN(cargaMinutos) || cargaMinutos <= 0) {
      toast({
        title: 'Carga inválida',
        description: 'Informe a carga diária em minutos (ex.: 480).',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (editandoId) {
        await atualizarFuncionario(editandoId, nome.trim(), cargaMinutos);
        toast({ title: 'Funcionário atualizado!', status: 'success', duration: 3000 });
      } else {
        await adicionarFuncionario(nome.trim(), cargaMinutos);
        toast({ title: 'Funcionário adicionado!', status: 'success', duration: 3000 });
      }

      setNome('');
      setCarga('');
      setEditandoId(null);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Erro ao salvar',
        description: error || 'Tente novamente',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditar = (id: string, nomeAtual: string, cargaAtual: number) => {
    setEditandoId(id);
    setNome(nomeAtual);
    setCarga(String(cargaAtual));
  };

  const handleRemover = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este funcionário?')) {
      await deletarFuncionario(id);
      toast({ title: 'Funcionário removido', status: 'info', duration: 3000 });
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4} color="#F5F8FF">
          Carregando funcionários...
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert status="warning" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <VStack spacing={4} align="stretch">
        <HStack>
          <Input
            placeholder="Nome do funcionário"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            bg="#051733"
            borderColor="whiteAlpha.300"
            color="white"
            _placeholder={{ color: 'whiteAlpha.500' }}
          />

          <Input
            placeholder="Carga diária (min)"
            type="number"
            value={carga}
            onChange={(e) => setCarga(e.target.value)}
            bg="#051733"
            borderColor="whiteAlpha.300"
            color="white"
            _placeholder={{ color: 'whiteAlpha.500' }}
          />

          <Button onClick={handleSubmit} bg="#1A3A73" color="white" _hover={{ bg: '#6FA8FF', color: '#051733' }}>
            {editandoId ? 'Atualizar' : 'Adicionar'}
          </Button>
        </HStack>

        {funcionarios.map((func) => (
          <HStack key={func.id} p={3} bg="#0B2247" borderRadius="md" borderWidth="1px" borderColor="whiteAlpha.200">
            <Text flex={1} color="#F5F8FF">
              {func.nome}
            </Text>
            <Text color="whiteAlpha.800">{func.cargaDiariaMinutos} min</Text>

            <IconButton
              aria-label="Editar"
              icon={<EditIcon />}
              size="sm"
              onClick={() => handleEditar(func.id, func.nome, func.cargaDiariaMinutos)}
            />
            <IconButton
              aria-label="Remover"
              icon={<DeleteIcon />}
              size="sm"
              colorScheme="red"
              onClick={() => handleRemover(func.id)}
            />
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};
