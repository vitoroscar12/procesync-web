'use client';

import React, { useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Select,
  Spinner,
  Stack,
  Text,
  VStack,
  useToast,
  type BadgeProps,
} from '@chakra-ui/react';
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, TimeIcon } from '@chakra-ui/icons';

import { useAuth } from '@/context/AuthContext';
import { iniciarTarefa, concluirTarefa } from '@/services/tarefas';
import { useMinhasTarefasSemana, type StatusTarefa, type Tarefa } from '@/hooks/useMinhasTarefasSemana';

// ===== helpers datas =====
const toISODateKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const isoToDate = (key: string): Date => {
  const [y, m, d] = key.split('-');
  return new Date(Number(y), Number(m) - 1, Number(d));
};

const formatarDataPtBR = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const nomeDiaCurto = (d: Date) => {
  const map: Record<number, string> = { 0: 'Dom', 1: 'Seg', 2: 'Ter', 3: 'Qua', 4: 'Qui', 5: 'Sex', 6: 'Sáb' };
  return map[d.getDay()] ?? '';
};

const startOfWeekMonday = (base: Date) => {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  return d;
};

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const formatarDuracao = (minutos: number) => {
  const total = minutos ?? 0;
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h <= 0) return `${m}m`;
  return `${h}h ${String(m).padStart(2, '0')}m`;
};

// Tipagem correta pro Chakra (sem any)
type StatusMeta = { label: string; scheme: BadgeProps['colorScheme'] };
const statusLabel: Record<StatusTarefa, StatusMeta> = {
  pendente: { label: 'PENDENTE', scheme: 'orange' },
  'em-andamento': { label: 'EM ANDAMENTO', scheme: 'blue' },
  concluida: { label: 'CONCLUÍDA', scheme: 'green' },
};

export function MinhaAgenda() {
  const toast = useToast();
  const { user, loading: authLoading } = useAuth();

  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeekMonday(new Date()));
  const weekStartISO = useMemo(() => toISODateKey(weekStart), [weekStart]);
  const weekEndISO = useMemo(() => toISODateKey(addDays(weekStart, 6)), [weekStart]);

  const dias = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(weekStart, i);
      const key = toISODateKey(d);
      return {
        key,
        display: `${nomeDiaCurto(d)} ${formatarDataPtBR(d)}`,
      };
    });
  }, [weekStart]);

  const { tarefas, loading, error } = useMinhasTarefasSemana({
    funcionarioId: user?.uid,
    weekStartISO,
    weekEndISO,
  });

  const [filtroStatus, setFiltroStatus] = useState<'todas' | StatusTarefa>('todas');

  const tarefasFiltradas = useMemo(() => {
    if (filtroStatus === 'todas') return tarefas;
    return tarefas.filter((t) => t.status === filtroStatus);
  }, [tarefas, filtroStatus]);

  const tarefasPorDia = useMemo(() => {
    const map = new Map<string, Tarefa[]>();
    for (const d of dias) map.set(d.key, []);
    for (const t of tarefasFiltradas) map.get(t.dia)?.push(t);
    return map;
  }, [dias, tarefasFiltradas]);

  const semanaAnterior = () => setWeekStart((prev) => addDays(prev, -7));
  const proximaSemana = () => setWeekStart((prev) => addDays(prev, 7));

  const iniciar = async (t: Tarefa) => {
    try {
      await iniciarTarefa(t.id);
      toast({ status: 'success', title: 'Tarefa iniciada' });
    } catch {
      toast({ status: 'error', title: 'Falha ao iniciar tarefa' });
    }
  };

  const concluir = async (t: Tarefa) => {
    try {
      await concluirTarefa(t.id);
      toast({ status: 'success', title: 'Tarefa concluída' });
    } catch {
      toast({ status: 'error', title: 'Falha ao concluir tarefa' });
    }
  };

  if (authLoading) {
    return (
      <Flex p={6} align="center" justify="center">
        <Spinner color="purple.300" />
      </Flex>
    );
  }

  return (
    <Box px={4} py={5} color="#F5F8FF">
      <Flex
        align="center"
        justify="space-between"
        gap={3}
        wrap="wrap"
        bg="#0B2247"
        borderWidth="1px"
        borderColor="whiteAlpha.200"
        borderRadius="lg"
        p={4}
      >
        <VStack align="start" spacing={0}>
          <Heading size="md">Minha Agenda</Heading>
          <Text fontSize="sm" color="whiteAlpha.700">
            Semana: {formatarDataPtBR(isoToDate(weekStartISO))} – {formatarDataPtBR(isoToDate(weekEndISO))}
          </Text>
        </VStack>

        <HStack spacing={2}>
          <IconButton aria-label="Semana anterior" icon={<ChevronLeftIcon />} onClick={semanaAnterior} />
          <IconButton aria-label="Próxima semana" icon={<ChevronRightIcon />} onClick={proximaSemana} />
        </HStack>
      </Flex>

      <Flex mt={4} align="center" justify="space-between" gap={3} wrap="wrap">
        <Text color="whiteAlpha.800" fontSize="sm">
          {user?.email ?? 'Colaborador'}
        </Text>

        <HStack spacing={2}>
          <Text fontSize="sm" color="whiteAlpha.700">
            Filtro:
          </Text>
          <Select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as typeof filtroStatus)}
            bg="#0B2247"
            borderColor="whiteAlpha.200"
            w="220px"
          >
            <option value="todas">Todas</option>
            <option value="pendente">Pendentes</option>
            <option value="em-andamento">Em andamento</option>
            <option value="concluida">Concluídas</option>
          </Select>
        </HStack>
      </Flex>

      <Box mt={4}>
        {loading && (
          <Flex align="center" justify="center" py={10}>
            <Spinner color="purple.300" />
          </Flex>
        )}

        {!loading && error && (
          <Box bg="rgba(255,0,0,0.12)" borderWidth="1px" borderColor="red.400" p={3} borderRadius="md">
            <Text color="red.200" fontSize="sm">
              {error}
            </Text>
          </Box>
        )}

        {!loading && !error && (
          <VStack align="stretch" spacing={4}>
            {dias.map((d) => {
              const lista = tarefasPorDia.get(d.key) ?? [];

              return (
                <Box key={d.key}>
                  <Text fontWeight="700" mb={2} color="whiteAlpha.900">
                    {d.display}
                  </Text>

                  {lista.length === 0 ? (
                    <Text fontSize="sm" color="whiteAlpha.600">
                      Sem tarefas.
                    </Text>
                  ) : (
                    <Stack spacing={3}>
                      {lista.map((t) => {
                        const sb = statusLabel[t.status];

                        return (
                          <Box
                            key={t.id}
                            bg="#0B2247"
                            borderWidth="1px"
                            borderColor="whiteAlpha.200"
                            borderRadius="lg"
                            p={3}
                          >
                            <Flex justify="space-between" align="start" gap={3}>
                              <Box flex="1" minW={0}>
                                <Text fontWeight="700" noOfLines={2}>
                                  {t.titulo}
                                </Text>

                                <HStack mt={2} spacing={3}>
                                  <Badge colorScheme={sb.scheme}>{sb.label}</Badge>

                                  <HStack spacing={1} color="whiteAlpha.800">
                                    <TimeIcon />
                                    <Text fontSize="sm">{formatarDuracao(t.duracao)}</Text>
                                  </HStack>
                                </HStack>
                              </Box>

                              <VStack spacing={2} align="stretch">
                                {t.status === 'pendente' && (
                                  <Button size="sm" colorScheme="blue" onClick={() => iniciar(t)}>
                                    Iniciar
                                  </Button>
                                )}
                                {t.status === 'em-andamento' && (
                                  <Button size="sm" colorScheme="green" leftIcon={<CheckIcon />} onClick={() => concluir(t)}>
                                    Concluído
                                  </Button>
                                )}
                                {t.status === 'concluida' && (
                                  <Button size="sm" variant="outline" isDisabled>
                                    Finalizada
                                  </Button>
                                )}
                              </VStack>
                            </Flex>
                          </Box>
                        );
                      })}
                    </Stack>
                  )}
                </Box>
              );
            })}
          </VStack>
        )}
      </Box>
    </Box>
  );
}
