'use client';

import React from 'react';
import { Box, Flex, Spinner, Center, Text } from '@chakra-ui/react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SideNav from '@/components/layout/SideNav';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  /*React.useEffect(() => {
    if (loading) return;

    // Não logado => manda pro login
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    // Logado mas sem profile => manda pro login (ou uma página de "setup perfil")
    if (!profile) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [user, profile, loading, router, pathname]);*/

  // Enquanto resolve auth/perfil, renderiza algo ESTÁVEL (evita hydration mismatch)
  if (loading) {
    return (
      <Flex minH="100vh" bg="#051733">
        <Center flex="1" flexDir="column">
          <Spinner color="#6FA8FF" thickness="3px" />
          <Text mt={3} color="#F5F8FF">
            Carregando...
          </Text>
        </Center>
      </Flex>
    );
  }

  // Enquanto redireciona, mantém tela vazia/estável
  if (!user) {
    return <Box minH="100vh" bg="#051733" />;
  }

  return (
    <Flex minH="100vh" bg="#051733">
      <SideNav />
      <Box flex="1" p={{ base: 4, md: 8 }} bg="#051733">
        {children}
      </Box>
    </Flex>
  );
}
