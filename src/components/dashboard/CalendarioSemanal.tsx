// src/components/dashboard/CalendarioSemanal.tsx
'use client';

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Button,
  HStack,
  Text,
  VStack,
  Grid,
  Tooltip,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tag,
  Badge,
  Spinner,
  Icon,
} from '@chakra-ui/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  AddIcon,
  EditIcon,
  DeleteIcon,
  TimeIcon,
  WarningIcon,
  CalendarIcon,
} from '@chakra-ui/icons';
import { FiUsers } from 'react-icons/fi'; // Importa FiUsers de react-icons/fi
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTarefasSemana, StatusTarefa } from '@/hooks/useTarefasSemana';
import { useFuncionarios, Funcionario } from '@/hooks/useFuncionarios';
import { criarTarefa, atualizarTarefa, deletarTarefa, CriarTarefaInput, AtualizarTarefaInput, Tarefa } from '@/services/tarefas';
import NovoFluxoModal from './NovoFluxoModal';
import { useRouter } from 'next/navigation';
import { darkBluePalette } from '@/styles/theme';

const palette = darkBluePalette;

const toISODateKey = (date: Date): string => format(date, 'yyyy-MM-dd'); // Formata para string YYYY-MM-DD

interface TarefaCardProps {
  tarefa: Tarefa;
  funcionario: Funcionario | undefined;
  onEdit: (tarefa: Tarefa) => void;
}

const TarefaCard = ({ tarefa, funcionario, onEdit }: TarefaCardProps) => {
  const getStatusColor = (status: StatusTarefa) => {
    switch (status) {
      case 'pendente': return 'orange';
      case 'em-andamento': return 'blue';
      case 'concluida': return 'green';
      default: return 'gray';
    }
  };

  return (
    <Box
      p={2}
      mb={2}
      bg={palette.medium}
      borderRadius="md"
      boxShadow="sm"
      cursor="pointer"
      _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
      onClick={() => onEdit(tarefa)}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontWeight="bold" fontSize="sm" color={palette.base}>
          {tarefa.titulo}
        </Text>
        <Badge colorScheme={getStatusColor(tarefa.status)} variant="solid" fontSize="0.7em">
          {tarefa.status.replace('-', ' ')}
        </Badge>
      </Flex>
      <Text fontSize="xs" color={palette.base}>
        {tarefa.horaInicio} - {tarefa.horaFim} ({tarefa.duracao} min)
      </Text>
      {funcionario && (
        <Text fontSize="xs" color={palette.light}>
          {funcionario.nome}
        </Text>
      )}
    </Box>
  );
};

const CalendarioSemanal = () => {
  const toast = useToast();
  const router = useRouter();

  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { locale: ptBR }));
  const { tarefas, loading: loadingTarefas, error: errorTarefas, refreshTarefas } = useTarefasSemana(currentWeekStart);
  const { funcionarios, loading: loadingFuncionarios, error: errorFuncionarios } = useFuncionarios();

  const { isOpen: isTaskModalOpen, onOpen: onTaskModalOpen, onClose: onTaskModalClose } = useDisclosure();
  const { isOpen: isNovoFluxoModalOpen, onOpen: onNovoFluxoModalOpen, onClose: onNovoFluxoModalClose } = useDisclosure();
  const { isOpen: isDeleteConfirmOpen, onOpen: onOpenDeleteConfirm, onClose: onDeleteConfirmClose } = useDisclosure();

  const [selectedTarefa, setSelectedTarefa] = useState<Tarefa | null>(null);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [salvandoTarefa, setSalvandoTarefa] = useState(false);

  // Estados do formulário de tarefa
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataAlocacao, setDataAlocacao] = useState(format(new Date(), 'yyyy-MM-dd')); // String
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [horaFim, setHoraFim] = useState('09:00');
  const [duracao, setDuracao] = useState(60);
  const [alocadoPara, setAlocadoPara] = useState('');
  const [status, setStatus] = useState<StatusTarefa>('pendente');
  const [categoriaId, setCategoriaId] = useState('');
  const [requisitoTreinamento, setRequisitoTreinamento] = useState('');

  const daysOfWeek = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  const groupedTasks = useMemo(() => {
    const groups: { [key: string]: { [key: string]: Tarefa[] } } = {}; // { 'YYYY-MM-DD': { 'funcionarioId': [tarefas] } }
    daysOfWeek.forEach(day => {
      const dayKey = toISODateKey(day);
      groups[dayKey] = {};
      funcionarios.forEach(func => {
        groups[dayKey][func.id] = [];
      });
    });

    tarefas.forEach(tarefa => {
      const dayKey = tarefa.dataAlocacao; // dataAlocacao já é string
      if (groups[dayKey] && groups[dayKey][tarefa.alocadoPara]) {
        groups[dayKey][tarefa.alocadoPara].push(tarefa);
      }
    });
    return groups;
  }, [tarefas, daysOfWeek, funcionarios]);

  const handlePrevWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const handleOpenTaskModal = (tarefa?: Tarefa, date?: Date, funcionarioId?: string) => {
    if (tarefa) {
      setSelectedTarefa(tarefa);
      setIsEditingTask(true);
      setTitulo(tarefa.titulo);
      setDescricao(tarefa.descricao || '');
      setDataAlocacao(tarefa.dataAlocacao); // Já é string
      setHoraInicio(tarefa.horaInicio);
      setHoraFim(tarefa.horaFim);
      setDuracao(tarefa.duracao);
      setAlocadoPara(tarefa.alocadoPara);
      setStatus(tarefa.status);
      setCategoriaId(tarefa.categoriaId || '');
      setRequisitoTreinamento(tarefa.requisitoTreinamento || '');
    } else {
      setSelectedTarefa(null);
      setIsEditingTask(false);
      setTitulo('');
      setDescricao('');
      setDataAlocacao(date ? toISODateKey(date) : format(new Date(), 'yyyy-MM-dd')); // Define a data como string
      setHoraInicio('08:00');
      setHoraFim('09:00');
      setDuracao(60);
      setAlocadoPara(funcionarioId || (funcionarios.length > 0 ? funcionarios[0].id : ''));
      setStatus('pendente');
      setCategoriaId('');
      setRequisitoTreinamento('');
    }
    onTaskModalOpen();
  };

  const handleSaveTask = async () => {
    setSalvandoTarefa(true);
    try {
      const taskData: CriarTarefaInput | AtualizarTarefaInput = {
        titulo,
        descricao,
        dataAlocacao, // Já é string
        horaInicio,
        horaFim,
        duracao,
        alocadoPara,
        status,
        categoriaId: categoriaId || undefined,
        requisitoTreinamento: requisitoTreinamento || undefined,
      };

      if (isEditingTask && selectedTarefa) {
        await atualizarTarefa(selectedTarefa.id, taskData);
        toast({
          title: 'Tarefa atualizada.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await criarTarefa(taskData as CriarTarefaInput);
        toast({
          title: 'Tarefa criada.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      await refreshTarefas(); // Atualiza a lista de tarefas
      onTaskModalClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao salvar tarefa:", error);
      toast({
        title: 'Erro ao salvar tarefa.',
        description: error.message || 'Ocorreu um erro inesperado.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSalvandoTarefa(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTarefa) return;
    setSalvandoTarefa(true); // Reutiliza o estado de salvando para indicar operação
    try {
      await deletarTarefa(selectedTarefa.id);
      toast({
        title: 'Tarefa deletada.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      await refreshTarefas();
      onDeleteConfirmClose();
      onTaskModalClose(); // Fecha o modal de edição também
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao deletar tarefa:", error);
      toast({
        title: 'Erro ao deletar tarefa.',
        description: error.message || 'Ocorreu um erro inesperado.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSalvandoTarefa(false);
    }
  };

  const handleOpenDeleteConfirm = (tarefa: Tarefa) => {
    setSelectedTarefa(tarefa);
    onOpenDeleteConfirm();
  };

  if (loadingTarefas || loadingFuncionarios) {
    return (
      <Flex justify="center" align="center" minH="calc(100vh - 64px)" bg={palette.primary} color={palette.base}>
        <Spinner size="xl" color={palette.light} />
        <Text ml={4}>Carregando calendário...</Text>
      </Flex>
    );
  }

  if (errorTarefas || errorFuncionarios) {
    return (
      <Flex justify="center" align="center" minH="calc(100vh - 64px)" bg={palette.primary} color={palette.base}>
        <Text color="red.500">Erro ao carregar dados: {errorTarefas?.message || errorFuncionarios?.message}</Text>
      </Flex>
    );
  }

  return (
    <Box p={4} bg={palette.primary} minH="calc(100vh - 64px)">
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <HStack spacing={4}>
          <IconButton
            aria-label="Semana Anterior"
            icon={<ChevronLeftIcon />}
            onClick={handlePrevWeek}
            bg={palette.medium}
            color={palette.base}
            _hover={{ bg: palette.light, color: palette.top }}
          />
          <Heading as="h2" size="lg" color={palette.light}>
            Semana de {format(currentWeekStart, 'dd MMM', { locale: ptBR })}
          </Heading>
          <IconButton
            aria-label="Próxima Semana"
            icon={<ChevronRightIcon />}
            onClick={handleNextWeek}
            bg={palette.medium}
            color={palette.base}
            _hover={{ bg: palette.light, color: palette.top }}
          />
        </HStack>
        <HStack spacing={3}>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={() => handleOpenTaskModal()}
            bg={palette.light}
            _hover={{ bg: palette.light, opacity: 0.8 }}
          >
            Nova Tarefa
          </Button>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="purple"
            onClick={onNovoFluxoModalOpen}
            bg={palette.light}
            _hover={{ bg: palette.light, opacity: 0.8 }}
          >
            Novo Fluxo
          </Button>
        </HStack>
      </Flex>

      <Box overflowX="auto">
        <Grid
          templateColumns={`200px repeat(${daysOfWeek.length}, 1fr)`}
          gap={1}
          minW="1200px" // Garante largura mínima para o scroll
        >
          {/* Cabeçalho: Dias da Semana */}
          <Box bg={palette.top} p={3} borderBottom="1px" borderColor={palette.medium}>
            <Text fontWeight="bold" color={palette.light}>Funcionários</Text>
          </Box>
          {daysOfWeek.map(day => (
            <Box key={toISODateKey(day)} bg={palette.top} p={3} borderBottom="1px" borderColor={palette.medium}>
              <Text fontWeight="bold" color={palette.light}>
                {format(day, 'EEE, dd/MM', { locale: ptBR })}
              </Text>
            </Box>
          ))}

          {/* Linhas: Funcionários e suas Tarefas */}
          {funcionarios.map(funcionario => (
            <React.Fragment key={funcionario.id}>
              <Box bg={palette.medium} p={3} borderRight="1px" borderColor={palette.medium}>
                <Flex alignItems="center">
                  <Icon as={FiUsers} mr={2} color={palette.light} />
                  <Text fontWeight="bold" color={palette.base}>{funcionario.nome}</Text>
                </Flex>
              </Box>
              {daysOfWeek.map(day => {
                const dayKey = toISODateKey(day);
                const tasksForDayAndEmployee = groupedTasks[dayKey]?.[funcionario.id] || [];
                return (
                  <VStack
                    key={`${dayKey}-${funcionario.id}`}
                    align="stretch"
                    p={2}
                    bg={isSameDay(day, new Date()) ? palette.medium : palette.primary} // Destaca o dia atual
                    borderRight="1px"
                    borderBottom="1px"
                    borderColor={palette.medium}
                    minH="120px" // Altura mínima para células vazias
                    onClick={() => handleOpenTaskModal(undefined, day, funcionario.id)}
                    cursor="pointer"
                    _hover={{ bg: palette.medium }}
                  >
                    {tasksForDayAndEmployee.map(tarefa => (
                      <TarefaCard
                        key={tarefa.id}
                        tarefa={tarefa}
                        funcionario={funcionario}
                        onEdit={handleOpenTaskModal}
                      />
                    ))}
                  </VStack>
                );
              })}
            </React.Fragment>
          ))}
        </Grid>
      </Box>

      {/* Modal de Novo Fluxo */}
      <NovoFluxoModal isOpen={isNovoFluxoModalOpen} onClose={onNovoFluxoModalClose} onFluxoCriado={refreshTarefas} />

      {/* Modal de Edição/Criação de Tarefa */}
      <Modal isOpen={isTaskModalOpen} onClose={onTaskModalClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={palette.primary} color="white">
          <ModalHeader borderBottomWidth="1px" borderColor={palette.medium}>
            {isEditingTask ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Título</FormLabel>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Título da Tarefa"
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
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descrição detalhada da tarefa"
                  bg={palette.medium}
                  borderColor={palette.medium}
                  _hover={{ borderColor: palette.light }}
                  _focus={{ borderColor: palette.light, boxShadow: 'outline' }}
                  color={palette.base}
                />
              </FormControl>
              <HStack>
                <FormControl isRequired>
                  <FormLabel>Data de Alocação</FormLabel>
                  <Input
                    type="date"
                    value={dataAlocacao}
                    onChange={(e) => setDataAlocacao(e.target.value)}
                    bg={palette.medium}
                    borderColor={palette.medium}
                    _hover={{ borderColor: palette.light }}
                    _focus={{ borderColor: palette.light, boxShadow: 'outline' }}
                    color={palette.base}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Hora Início</FormLabel>
                  <Input
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
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
                    value={horaFim}
                    onChange={(e) => setHoraFim(e.target.value)}
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
                <NumberInput min={1} value={duracao} onChange={(val) => setDuracao(parseInt(val))}>
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
                  value={alocadoPara}
                  onChange={(e) => setAlocadoPara(e.target.value)}
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
              <FormControl isRequired>
                <FormLabel>Status</FormLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StatusTarefa)}
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
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
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
                  value={requisitoTreinamento}
                  onChange={(e) => setRequisitoTreinamento(e.target.value)}
                  placeholder="Ex: NR-35"
                  bg={palette.medium}
                  borderColor={palette.medium}
                  _hover={{ borderColor: palette.light }}
                  _focus={{ borderColor: palette.light, boxShadow: 'outline' }}
                  color={palette.base}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter borderTopWidth="1px" borderColor={palette.medium}>
            <Button variant="ghost" onClick={onTaskModalClose} mr={3} color="white">
              Cancelar
            </Button>
            {isEditingTask && (
              <Button colorScheme="red" mr={3} onClick={() => handleOpenDeleteConfirm(selectedTarefa!)}>
                <DeleteIcon mr={2} /> Deletar
              </Button>
            )}
            <Button colorScheme="blue" onClick={handleSaveTask} isLoading={salvandoTarefa} loadingText="Salvando" bg={palette.light} _hover={{ bg: palette.light, opacity: 0.8 }}>
              {isEditingTask ? 'Salvar Alterações' : 'Criar Tarefa'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal isOpen={isDeleteConfirmOpen} onClose={onDeleteConfirmClose}>
        <ModalOverlay />
        <ModalContent bg={palette.primary} color="white">
          <ModalHeader borderBottomWidth="1px" borderColor={palette.medium}>Confirmar Exclusão</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Tem certeza que deseja deletar a tarefa **{selectedTarefa?.titulo}**?</Text>
            <Text fontSize="sm" color="red.300">Esta ação não pode ser desfeita.</Text>
          </ModalBody>
          <ModalFooter borderTopWidth="1px" borderColor={palette.medium}>
            <Button variant="ghost" onClick={onDeleteConfirmClose} mr={3} color="white">
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleDeleteTask} isLoading={salvandoTarefa}>
              Deletar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CalendarioSemanal;
