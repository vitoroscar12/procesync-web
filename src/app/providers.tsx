// src/app/providers.tsx
'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '@/context/AuthContext';
import { createProceSyncTheme } from '@/styles/theme'; // Importa a função para criar o tema

const theme = createProceSyncTheme(); // Cria o tema no lado do cliente

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ChakraProvider>
  );
}
