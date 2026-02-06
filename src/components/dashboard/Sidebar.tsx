// src/components/dashboard/Sidebar.tsx
'use client';

import React from 'react';
import { Box, VStack, Text, Link, Icon, Divider, Button, Flex, Image } from '@chakra-ui/react';
import { FiCalendar, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi'; // Importa de react-icons/fi
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { darkBluePalette } from '@/styles/theme';

const palette = darkBluePalette;

interface NavItemProps {
  icon: React.ElementType;
  children: React.ReactNode;
  href: string;
  isActive: boolean;
}

const NavItem = ({ icon, children, href, isActive }: NavItemProps) => {
  return (
    <Link
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      w="full"
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? palette.medium : 'transparent'}
        color={isActive ? palette.light : palette.base}
        _hover={{
          bg: palette.medium,
          color: palette.light,
        }}
      >
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: palette.light,
          }}
          as={icon}
        />
        {children}
      </Flex>
    </Link>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/'); // Redireciona para a página de login após o logout
  };

  return (
    <Box
      bg={palette.top}
      borderRight="1px"
      borderRightColor={palette.medium}
      w={{ base: 'full', md: '250px' }}
      pos="fixed"
      h="full"
      zIndex="sticky"
      shadow="md"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image src="/logo.png" alt="ProceSync Logo" boxSize="80px" objectFit="contain" mr={2} />
        <Text fontSize="3xl" fontFamily="heading" fontWeight="bold" color={palette.light}>
          ProceSync
        </Text>
      </Flex>
      <Divider borderColor={palette.medium} />
      <VStack spacing={1} align="stretch" mt={4}>
        <NavItem icon={FiCalendar} href="/dashboard/calendario" isActive={pathname === '/dashboard/calendario'}>
          Calendário
        </NavItem>
        <NavItem icon={FiUsers} href="/dashboard/equipe" isActive={pathname === '/dashboard/equipe'}>
          Equipe
        </NavItem>
        <NavItem icon={FiSettings} href="/dashboard/admin" isActive={pathname === '/dashboard/admin'}>
          Admin
        </NavItem>
      </VStack>
      <Box p={4} position="absolute" bottom="0" w="full">
        <Button
          leftIcon={<FiLogOut />}
          colorScheme="red"
          variant="ghost"
          onClick={handleLogout}
          w="full"
          justifyContent="flex-start"
          color="white"
          _hover={{ bg: palette.medium }}
        >
          Sair
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
