// src/hooks/useTarefasSemana.ts
import { useState, useEffect, useCallback } from 'react';
import { endOfWeek } from 'date-fns';
import { getTarefasPorSemana, Tarefa, StatusTarefa, CriarTarefaInput, AtualizarTarefaInput } from '@/services/tarefas';
import { ptBR } from 'date-fns/locale'; // Importa ptBR

export type { Tarefa, StatusTarefa, CriarTarefaInput, AtualizarTarefaInput }; // Re-exporta os tipos

export const useTarefasSemana = (currentWeekStart: Date) => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshTarefas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const weekEnd = endOfWeek(currentWeekStart, { locale: ptBR });
      const fetchedTarefas = await getTarefasPorSemana(currentWeekStart, weekEnd);
      setTarefas(fetchedTarefas);
    } catch (err) {
      console.error("Erro ao buscar tarefas da semana:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [currentWeekStart]);

  useEffect(() => {
    refreshTarefas();
  }, [refreshTarefas]);

  return { tarefas, loading, error, refreshTarefas };
};
