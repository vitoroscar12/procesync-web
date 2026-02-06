// src/app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Flex, Spinner, Text } from '@chakra-ui/react';
import { darkBluePalette } from '@/styles/theme';

const palette = darkBluePalette;

export default function DashboardRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/calendario');
  }, [router]);

  return (
    <Flex
      minH="calc(100vh - 64px)" // Ajuste para considerar a altura do header/sidebar
      align="center"
      justify="center"
      bg={palette.primary}
      color={palette.base}
    >
      <Spinner size="xl" color={palette.light} mr={4} />
      <Text fontSize="xl">Redirecionando para o calendário...</Text>
    </Flex>
  );
}
