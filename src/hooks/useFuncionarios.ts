// src/hooks/useFuncionarios.ts
import { useState, useEffect, useCallback } from 'react';
import { getFuncionarios, Funcionario } from '@/services/funcionarios';

export type { Funcionario }; // Re-exporta o tipo

export const useFuncionarios = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshFuncionarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedFuncionarios = await getFuncionarios();
      setFuncionarios(fetchedFuncionarios);
    } catch (err) {
      console.error("Erro ao buscar funcionários:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFuncionarios();
  }, [refreshFuncionarios]);

  return { funcionarios, loading, error, refreshFuncionarios };
};
