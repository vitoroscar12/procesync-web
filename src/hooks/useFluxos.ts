// src/hooks/useFluxos.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getFluxos, Fluxo, FluxoTarefa } from '@/services/fluxos'; // Importa Fluxo e FluxoTarefa corretamente

interface UseFluxosResult {
  fluxos: Fluxo[];
  loadingFluxos: boolean;
  errorFluxos: Error | null;
  refetchFluxos: () => void;
}

export const useFluxos = (): UseFluxosResult => {
  const [fluxos, setFluxos] = useState<Fluxo[]>([]);
  const [loadingFluxos, setLoadingFluxos] = useState(true);
  const [errorFluxos, setErrorFluxos] = useState<Error | null>(null);

  const fetchFluxos = useCallback(async () => {
    setLoadingFluxos(true);
    setErrorFluxos(null);
    try {
      const data = await getFluxos();
      setFluxos(data);
    } catch (err: unknown) {
      setErrorFluxos(err as Error);
      console.error("Erro ao buscar fluxos:", err);
    } finally {
      setLoadingFluxos(false);
    }
  }, []);

  useEffect(() => {
    fetchFluxos();
  }, [fetchFluxos]);

  return { fluxos, loadingFluxos, errorFluxos, refetchFluxos: fetchFluxos };
};
