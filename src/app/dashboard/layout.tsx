// src/app/dashboard/layout.tsx
'use client';

import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '@/components/dashboard/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { darkBluePalette } from '@/styles/theme';

const palette = darkBluePalette;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se não estiver carregando e não houver usuário, redireciona para a página de login
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Se estiver carregando ou o usuário não estiver logado, não renderiza o layout do dashboard
  if (loading || !user) {
    return (
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bg={palette.primary}
        color={palette.base}
      >
        {/* Pode adicionar um spinner aqui */}
        <Box>Carregando dashboard...</Box>
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" bg={palette.primary}>
      <Sidebar />
      <Box flex="1" p={4} ml={{ base: 0, md: '250px' }} transition="margin-left 0.3s ease-in-out">
        {children}
      </Box>
    </Flex>
  );
}
