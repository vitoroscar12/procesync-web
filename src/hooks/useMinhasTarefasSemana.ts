'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where, type Timestamp } from 'firebase/firestore';
import { db } from '@/services/firebase';

export type StatusTarefa = 'pendente' | 'em-andamento' | 'concluida';

export type Tarefa = {
  id: string;
  titulo: string;
  funcionarioId: string;
  funcionarioNome?: string;
  dia: string; // ISO YYYY-MM-DD
  status: StatusTarefa;
  duracao: number; // minutos
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

type Params = {
  funcionarioId?: string | null;
  weekStartISO: string; // YYYY-MM-DD (segunda)
  weekEndISO: string;   // YYYY-MM-DD (domingo)
};

type InternalState = {
  key: string;
  tarefas: Tarefa[];
  loading: boolean;
  error: string | null;
};

export function useMinhasTarefasSemana({ funcionarioId, weekStartISO, weekEndISO }: Params) {
  const canQuery = useMemo(
    () => Boolean(funcionarioId && weekStartISO && weekEndISO),
    [funcionarioId, weekStartISO, weekEndISO]
  );

  const key = useMemo(() => {
    if (!canQuery) return 'no-query';
    return `${funcionarioId}|${weekStartISO}|${weekEndISO}`;
  }, [canQuery, funcionarioId, weekStartISO, weekEndISO]);

  const [state, setState] = useState<InternalState>(() => ({
    key,
    tarefas: [],
    loading: canQuery, // se já nasce com query válida, já começa loading true
    error: null,
  }));

  // Reset de estado quando o "key" muda (feito no render, NÃO no effect)
  if (state.key !== key) {
    setState({
      key,
      tarefas: [],
      loading: canQuery,
      error: null,
    });
  }

  useEffect(() => {
    if (!canQuery) return;

    const ref = collection(db, 'tarefas');
    const q = query(
      ref,
      where('funcionarioId', '==', funcionarioId),
      where('dia', '>=', weekStartISO),
      where('dia', '<=', weekEndISO),
      orderBy('dia', 'asc')
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: Tarefa[] = snap.docs.map((doc) => {
          const d = doc.data() as Omit<Tarefa, 'id'>;
          return { id: doc.id, ...d };
        });

        // setState apenas dentro do callback do sistema externo (Firestore)
        setState((prev) => {
          // segurança: se mudou a semana/usuário durante a leitura, ignora atualização velha
          if (prev.key !== key) return prev;
          return { ...prev, tarefas: list, loading: false, error: null };
        });
      },
      (err) => {
        console.error(err);
        setState((prev) => {
          if (prev.key !== key) return prev;
          return { ...prev, loading: false, error: err.message || 'Falha ao carregar tarefas.' };
        });
      }
    );

    return () => unsub();
  }, [canQuery, funcionarioId, weekStartISO, weekEndISO, key]);

  // Se não pode consultar, retorna vazio sem “mexer” em estado
  if (!canQuery) return { tarefas: [], loading: false, error: null };

  return { tarefas: state.tarefas, loading: state.loading, error: state.error };
}
