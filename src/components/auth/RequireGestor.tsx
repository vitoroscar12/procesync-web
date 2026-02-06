// src/components/auth/RequireGestor.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Center, Spinner, Text } from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext';

export function RequireGestor({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) router.replace('/login');
    else if (!profile) router.replace('/login'); // sem perfil, força tratar
    else if (profile.role !== 'gestor') router.replace('/mobile'); // ajuste a rota do colaborador
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <Center py={10} flexDir="column">
        <Spinner />
        <Text mt={3} color="#F5F8FF">
          Verificando acesso...
        </Text>
      </Center>
    );
  }

  // Enquanto redireciona, evita “piscar”
  if (!user || !profile || profile.role !== 'gestor') {
    return <Box />;
  }

  return <>{children}</>;
}
