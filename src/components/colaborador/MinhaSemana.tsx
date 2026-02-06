'use client';

import React, { useMemo, useState } from 'react';
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Spinner,
  Stack,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon, TimeIcon } from '@chakra-ui/icons';

import { useAuth } from '@/context/AuthContext';
import { atualizarStatusTarefa } from '@/services/tarefas';
import { useMinhasTarefasSemana, type Tarefa, type StatusTarefa } from '@/hooks/useMinhasTarefasSemana';

// ===== Helpers de data =====
const toISODateKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const isoToDate = (key: string): Date => {
  const parts = key.split('-');
  const y = Number(parts[0] ?? '1970');
  const m = Number(parts[1] ?? '01');
  const d = Number(parts[2] ?? '01');
  return new Date(y, m - 1, d);
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

const nomeDiaCurto = (d: Date) => {
  const map: Record<number, string> = { 0: 'Dom', 1: 'Seg', 2: 'Ter', 3: 'Qua', 4: 'Qui', 5: 'Sex', 6: 'Sáb' };
  return map[d.getDay()] ?? '';
};

const formatarDataPtBR = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const formatarDuracao = (minutos: number) => {
  if (!minutos || minutos <= 0) return '0m';
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  return `${m}m`;
};

const statusBadge = (s: StatusTarefa) => {
  if (s === 'pendente') return { label: 'PENDENTE', scheme: 'orange' as const };
  if (s === 'em-andamento') return { label: 'EM ANDAMENTO', scheme: 'blue' as const };
  return { label: 'CONCLUÍDA', scheme: 'green' as const };
};

export function MinhaSemana() {
  const toast = useToast();
  const { user } = useAuth();

  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeekMonday(new Date()));

  const dias = useMemo(() => {
    const arr = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    return arr.map((d) => ({
      key: toISODateKey(d),
      label: `${nomeDiaCurto(d)} ${formatarDataPtBR(d)}`,
    }));
  }, [weekStart]);

  const weekStartISO = dias[0]?.key ?? toISODateKey(weekStart);
  const weekEndISO = dias[6]?.key ?? toISODateKey(addDays(weekStart, 6));

  const { tarefas, loading, error } = useMinhasTarefasSemana({
    funcionarioId: user?.uid,
    weekStartISO,
    weekEndISO,
  });

  const tarefasPorDia = useMemo(() => {
    const map = new Map<string, Tarefa[]>();
    for (const d of dias) map.set(d.key, []);
    for (const t of tarefas) {
      if (!map.has(t.dia)) map.set(t.dia, []);
      map.get(t.dia)!.push(t);
    }
    return map;
  }, [tarefas, dias]);

  const avancarSemana = (delta: number) => setWeekStart((prev) => addDays(prev, delta * 7));

  const marcarEmAndamento = async (t: Tarefa) => {
    try {
      await atualizarStatusTarefa(t.id, 'em-andamento');
      toast({ status: 'success', title: 'Tarefa iniciada' });
    } catch (e) {
      console.error(e);
      toast({ status: 'error', title: 'Falha ao iniciar tarefa' });
    }
  };

  const marcarConcluida = async (t: Tarefa) => {
    try {
      await atualizarStatusTarefa(t.id, 'concluida');
      toast({ status: 'success', title: 'Tarefa concluída' });
    } catch (e) {
      console.error(e);
      toast({ status: 'error', title: 'Falha ao concluir tarefa' });
    }
  };

  return (
    <Box p={{ base: 3, md: 6 }} bg="#051733" minH="100vh">
      <Flex
        bg="#0B2247"
        borderWidth="1px"
        borderColor="whiteAlpha.200"
        borderRadius="xl"
        p={4}
        align="center"
        justify="space-between"
        gap={3}
        wrap="wrap"
      >
        <Box>
          <Heading size="md" color="#F5F8FF">
            Minha semana
          </Heading>
          <Text color="whiteAlpha.700" fontSize="sm">
            {formatarDataPtBR(isoToDate(weekStartISO))} - {formatarDataPtBR(isoToDate(weekEndISO))}
          </Text>
        </Box>

        <HStack>
          <IconButton aria-label="Semana anterior" icon={<ChevronLeftIcon />} onClick={() => avancarSemana(-1)} />
          <IconButton aria-label="Próxima semana" icon={<ChevronRightIcon />} onClick={() => avancarSemana(1)} />
        </HStack>
      </Flex>

      <Box mt={4}>
        {loading && (
          <Flex align="center" gap={3} color="whiteAlpha.800">
            <Spinner />
            <Text>Carregando tarefas…</Text>
          </Flex>
        )}

        {error && (
          <Alert status="error" mt={3}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <VStack spacing={4} align="stretch">
            {dias.map((d) => {
              const lista = tarefasPorDia.get(d.key) ?? [];
              return (
                <Box
                  key={d.key}
                  bg="rgba(255,255,255,0.04)"
                  borderWidth="1px"
                  borderColor="whiteAlpha.200"
                  borderRadius="xl"
                  p={4}
                >
                  <Flex justify="space-between" align="center" mb={3}>
                    <Text color="#F5F8FF" fontWeight="700">
                      {d.label}
                    </Text>
                    <Badge colorScheme="purple" variant="subtle">
                      {lista.length} tarefa(s)
                    </Badge>
                  </Flex>

                  {lista.length === 0 ? (
                    <Text color="whiteAlpha.600" fontSize="sm">
                      Nenhuma tarefa para este dia.
                    </Text>
                  ) : (
                    <Stack spacing={3}>
                      {lista.map((t) => {
                        const sb = statusBadge(t.status);
                        return (
                          <Box
                            key={t.id}
                            bg="rgba(5,15,38,0.55)"
                            borderWidth="1px"
                            borderColor="whiteAlpha.200"
                            borderRadius="lg"
                            p={3}
                          >
                            <Flex justify="space-between" align="start" gap={3}>
                              <Box flex="1" minW={0}>
                                <Text color="white" fontWeight="700" noOfLines={2}>
                                  {t.titulo}
                                </Text>
                                <HStack mt={2} spacing={3}>
                                  <Badge colorScheme={sb.scheme} variant="solid">
                                    {sb.label}
                                  </Badge>
                                  <HStack spacing={1} color="whiteAlpha.800">
                                    <TimeIcon />
                                    <Text fontSize="sm">{formatarDuracao(t.duracao)}</Text>
                                  </HStack>
                                </HStack>
                              </Box>

                              <VStack align="stretch" spacing={2}>
                                {t.status === 'pendente' && (
                                  <Button size="sm" colorScheme="blue" onClick={() => marcarEmAndamento(t)}>
                                    Iniciar
                                  </Button>
                                )}
                                {t.status === 'em-andamento' && (
                                  <Button
                                    size="sm"
                                    colorScheme="green"
                                    leftIcon={<CheckIcon />}
                                    onClick={() => marcarConcluida(t)}
                                  >
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
