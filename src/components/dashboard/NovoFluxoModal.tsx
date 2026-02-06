/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/dashboard/NovoFluxoModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
  Box,
  Text,
  IconButton,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Spinner,
  Heading,
  HStack,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useFuncionarios } from '@/hooks/useFuncionarios';
import { criarTarefa, CriarTarefaInput, StatusTarefa } from '@/services/tarefas';
import { format, addDays, parseISO } from 'date-fns';
import { darkBluePalette } from '@/styles/theme';
import { Timestamp } from 'firebase/firestore'; // Importa Timestamp para createdAt/updatedAt

const palette = darkBluePalette;

interface NovoFluxoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFluxoCriado: () => void;
}

interface FluxoStep {
  titulo: string;
  descricao: string;
  duracao: number; // em minutos
  alocadoPara: string; // ID do funcionário
  status: StatusTarefa;
  categoriaId?: string;
  requisitoTreinamento?: string;
  offsetDays: number; // Quantos dias após a data de início do fluxo
  horaInicio: string;
  horaFim: string;
}

const NovoFluxoModal = ({ isOpen, onClose, onFluxoCriado }: NovoFluxoModalProps) => {
  const toast = useToast();
  const { funcionarios, loading: loadingFuncionarios } = useFuncionarios();

  const [nomeFluxo, setNomeFluxo] = useState('');
  const [dataInicioFluxo, setDataInicioFluxo] = useState(format(new Date(), 'yyyy-MM-dd')); // String
  const [steps, setSteps] = useState<FluxoStep[]>([
    {
      titulo: '',
      descricao: '',
      duracao: 60,
      alocadoPara: '',
      status: 'pendente',
      offsetDays: 0,
      horaInicio: '08:00',
      horaFim: '09:00',
    },
  ]);
  const [salvandoFluxo, setSalvandoFluxo] = useState(false);

  useEffect(() => {
    if (funcionarios.length > 0 && steps[0].alocadoPara === '') {
      setSteps(prevSteps => prevSteps.map(step => ({
        ...step,
        alocadoPara: step.alocadoPara || funcionarios[0].id,
      })));
    }
  }, [funcionarios, steps]);

  const handleAddStep = () => {
    setSteps([...steps, {
      titulo: '',
      descricao: '',
      duracao: 60,
      alocadoPara: funcionarios.length > 0 ? funcionarios[0].id : '',
      status: 'pendente',
      offsetDays: 0,
      horaInicio: '08:00',
      horaFim: '09:00',
    }]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleStepChange = (index: number, field: keyof FluxoStep, value: any) => {
    const newSteps = [...steps];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newSteps[index] as any)[field] = value;
    setSteps(newSteps);
  };

  const handleSaveFluxo = async () => {
    setSalvandoFluxo(true);
    try {
      if (!nomeFluxo.trim() || !dataInicioFluxo.trim()) {
        toast({
          title: 'Campos obrigatórios.',
          description: 'Nome do fluxo e Data de Início são obrigatórios.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      for (const step of steps) {
        if (!step.titulo.trim() || !step.alocadoPara.trim() || !step.horaInicio.trim() || !step.horaFim.trim()) {
          toast({
            title: 'Campos obrigatórios nas etapas.',
            description: 'Título, Alocado Para, Hora Início e Hora Fim são obrigatórios para todas as etapas.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      }

      const baseDate = parseISO(dataInicioFluxo); // Converte a string de data para objeto Date

      for (const step of steps) {
        const taskDate = addDays(baseDate, step.offsetDays);
        const taskData: CriarTarefaInput = {
          titulo: `${nomeFluxo}: ${step.titulo}`, // Combina nome do fluxo com título da etapa
          descricao: step.descricao,
          dataAlocacao: format(taskDate, 'yyyy-MM-dd'), // Formata a data para string
          horaInicio: step.horaInicio,
          horaFim: step.horaFim,
          duracao: step.duracao,
          alocadoPara: step.alocadoPara,
          status: step.status,
          categoriaId: step.categoriaId || undefined,
          requisitoTreinamento: step.requisitoTreinamento || undefined,
        };
        await criarTarefa(taskData);
      }

      toast({
        title: 'Fluxo criado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onFluxoCriado(); // Notifica o CalendarioSemanal para recarregar as tarefas
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao criar fluxo:", error);
      toast({
        title: 'Erro ao criar fluxo.',
        description: error.message || 'Ocorreu um erro inesperado.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSalvandoFluxo(false);
    }
  };

  if (loadingFuncionarios) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={palette.primary} color="white">
          <ModalHeader borderBottomWidth="1px" borderColor={palette.medium}>Criar Novo Fluxo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex justify="center" align="center" minH="150px">
              <Spinner size="lg" color={palette.light} />
              <Text ml={4}>Carregando funcionários...</Text>
            </Flex>
          </ModalBody>
          <ModalFooter borderTopWidth="1px" borderColor={palette.medium}>
            <Button variant="ghost" onClick={onClose} color="white">Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg={palette.primary} color="white">
        <ModalHeader borderBottomWidth="1px" borderColor={palette.medium}>Criar Novo Fluxo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Nome do Fluxo</FormLabel>
              <Input
                value={nomeFluxo}
                onChange={(e) => setNomeFluxo(e.target.value)}
                placeholder="Ex: Onboarding de Novo Colaborador"
                bg={palette.medium}
                borderColor={palette.medium}
                _hover={{ borderColor: palette.light }}
                _focus={{ borderColor: palette.light, boxShadow: 'outline' }}
                color={palette.base}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Data de Início do Fluxo</FormLabel>
              <Input
                type="date"
                value={dataInicioFluxo}
                onChange={(e) => setDataInicioFluxo(e.target.value)}
                bg={palette.medium}
                borderColor={palette.medium}
                _hover={{ borderColor: palette.light }}
                _focus={{ borderColor: palette.light, boxShadow: 'outline' }}
                color={palette.base}
              />
            </FormControl>

            <Text fontSize="lg" fontWeight="bold" color={palette.light}>Etapas do Fluxo</Text>
            {steps.map((step, index) => (
              <Box key={index} p={4} borderWidth="1px" borderRadius="md" borderColor={palette.medium} bg={palette.top}>
                <Flex justifyContent="space-between" alignItems="center" mb={3}>
                  <Heading size="sm" color={palette.light}>Etapa {index + 1}</Heading>
                  {steps.length > 1 && (
                    <IconButton
                      aria-label="Remover Etapa"
                      icon={<DeleteIcon />}
                      onClick={() => handleRemoveStep(index)}
                      colorScheme="red"
                      variant="ghost"
                    />
                  )}
                </Flex>
                <Stack spacing={3}>
                  <FormControl isRequired>
                    <FormLabel>Título da Etapa</FormLabel>
                    <Input
                      value={step.titulo}
                      onChange={(e) => handleStepChange(index, 'titulo', e.target.value)}
                      placeholder="Ex: Configurar Ambiente de Trabalho"
                      bg={palette.medium}
                      borderColor={palette.medium}
                      _hover={{ borderColor: palette.light }}
                      _focus={{ borderColor: palette.light, boxShadow: 'outline' }}
                      color={palette.base}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Descrição</FormLabel>
                    <Input
                      value={step.descricao}
                      onChange={(e) => handleStepChange(index, 'descricao', e.target.value)}
                      placeholder="Detalhes da etapa"
                      bg={palette.medium}
                      borderColor={palette.medium}
                      _hover={{ borderColor: palette.light }}
                      _focus={{ borderColor: palette.light, boxShadow: 'outline' }}
                      color={palette.base}
                    />
                  </FormControl>
                  <HStack>
                    <FormControl isRequired>
                      <FormLabel>Hora Início</FormLabel>
                      <Input
                        type="time"
                        value={step.horaInicio}
                        onChange={(e) => handleStepChange(index, 'horaInicio', e.target.value)}
                        bg={palette.medium}
                        borderColor={palette.medium}
                        _hover={{ borderColor: palette.light }}
                        _focus={{ borderColor: palette.light, boxShadow: 'outline' }}
                        color={palette.base}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Hora Fim</FormLabel>
                      <Input
                        type="time"
                        value={step.horaFim}
                        onChange={(e) => handleStepChange(index, 'horaFim', e.target.value)}
                        bg={palette.medium}
                        borderColor={palette.medium}
                        _hover={{ borderColor: palette.light }}
                        _focus={{ borderColor: palette.light, boxShadow: 'outline' }}
                        color={palette.base}
                      />
                    </FormControl>
                  </HStack>
                  <FormControl isRequired>
                    <FormLabel>Duração (minutos)</FormLabel>
                    <NumberInput min={1} value={step.duracao} onChange={(val) => handleStepChange(index, 'duracao', parseInt(val))}>
                      <NumberInputField
                        bg={palette.medium}
                        borderColor={palette.medium}
                        _hover={{ borderColor: palette.light }}
                        _focus={{ borderColor: palette.light, boxShadow: 'outline' }}
                        color={palette.base}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Alocado Para</FormLabel>
                    <Select
                      value={step.alocadoPara}
                      onChange={(e) => handleStepChange(index, 'alocadoPara', e.target.value)}
                      placeholder="Selecione um funcionário"
                      bg={palette.medium}
                      borderColor={palette.medium}
                      _hover={{ borderColor: palette.light }}
                      _focus={{ borderColor: palette.light, boxShadow: 'outline' }}
                      color={palette.base}
                    >
                      {funcionarios.map(func => (
                        <option key={func.id} value={func.id}>{func.nome}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Dias Após Início do Fluxo</FormLabel>
                    <NumberInput min={0} value={step.offsetDays} onChange={(val) => handleStepChange(index, 'offsetDays', parseInt(val))}>
                      <NumberInputField
                        bg={palette.medium}
                        borderColor={palette.medium}
                        _hover={{ borderColor: palette.light }}
                        _focus={{ borderColor: palette.light, boxShadow: 'outline' }}
                        color={palette.base}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={step.status}
                      onChange={(e) => handleStepChange(index, 'status', e.target.value as StatusTarefa)}
                      bg={palette.medium}
                      borderColor={palette.medium}
                      _hover={{ borderColor: palette.light }}
                      _focus={{ borderColor: palette.light, boxShadow: 'outline' }}
                      color={palette.base}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em-andamento">Em Andamento</option>
                      <option value="concluida">Concluída</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Categoria (Opcional)</FormLabel>
                    <Input
                      value={step.categoriaId || ''}
                      onChange={(e) => handleStepChange(index, 'categoriaId', e.target.value)}
                      placeholder="ID da Categoria"
                      bg={palette.medium}
                      borderColor={palette.medium}
                      _hover={{ borderColor: palette.light }}
                      _focus={{ borderColor: palette.light, boxShadow: 'outline' }}
                      color={palette.base}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Requisito de Treinamento (Opcional)</FormLabel>
                    <Input
                      value={step.requisitoTreinamento || ''}
                      onChange={(e) => handleStepChange(index, 'requisitoTreinamento', e.target.value)}
                      placeholder="Ex: NR-35"
                      bg={palette.medium}
                      borderColor={palette.medium}
                      _hover={{ borderColor: palette.light }}
                      _focus={{ borderColor: palette.light, boxShadow: 'outline' }}
                      color={palette.base}
                    />
                  </FormControl>
                </Stack>
              </Box>
            ))}
            <Button leftIcon={<AddIcon />} colorScheme="green" onClick={handleAddStep} variant="outline" borderColor={palette.light} color={palette.light} _hover={{ bg: palette.medium }}>
              Adicionar Etapa
            </Button>
          </Stack>
        </ModalBody>
        <ModalFooter borderTopWidth="1px" borderColor={palette.medium}>
          <Button variant="ghost" onClick={onClose} mr={3} color="white">
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleSaveFluxo} isLoading={salvandoFluxo} loadingText="Criando Fluxo" bg={palette.light} _hover={{ bg: palette.light, opacity: 0.8 }}>
            Criar Fluxo
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NovoFluxoModal;
