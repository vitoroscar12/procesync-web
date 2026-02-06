// src/components/layout/Sidebar.tsx

import { Box, VStack, Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import { FiHome, FiCalendar, FiUser, FiSettings } from 'react-icons/fi';

export function Sidebar() {
  const navItems = [
    { icon: FiHome, label: 'Dashboard', href: '/dashboard' },
    { icon: FiCalendar, label: 'Calendário', href: '/dashboard/calendario' },
    { icon: FiUser, label: 'Perfil', href: '/dashboard/perfil' },
    { icon: FiSettings, label: 'Configurações', href: '/dashboard/configuracoes' },
  ];

  return (
    <Box
      as="nav"
      bg="brand.sidebarBg"
      color="white"
      w="200px" // Largura fixa
      minH="calc(100vh - 64px)"
      p={4}
      boxShadow="xl"
      position="sticky" // Mantém fixa ao rolar a página
      top="64px" // Posiciona abaixo do header
      left="0"
    >
      <VStack align="stretch" spacing={3}>
        {navItems.map((item) => (
          <Button
            key={item.label}
            as={Link}
            href={item.href}
            variant="ghost"
            justifyContent="flex-start"
            leftIcon={<item.icon size="20px" />}
            py={6}
            bg="transparent"
            _hover={{
              bg: 'whiteAlpha.200',
              color: 'white',
            }}
            _active={{
              bg: 'whiteAlpha.300',
            }}
            color="white"
            width="100%" // Garante que o botão ocupe toda a largura
          >
            <Flex ml={2}>
              {item.label}
            </Flex>
          </Button>
        ))}
      </VStack>
    </Box>
  );
}
