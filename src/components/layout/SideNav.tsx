    // src/components/layout/SideNav.tsx
    'use client'; // Componentes de navegação com NextLink geralmente são Client Components

    import { Box, VStack, Text } from '@chakra-ui/react';
    import Link from 'next/link'; // Usar o Link do next/link diretamente
    import { usePathname } from 'next/navigation'; // Para destacar o link ativo

    export default function SideNav() {
      const pathname = usePathname(); // Hook para pegar a rota atual

      const navItems = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Equipe', href: '/dashboard/equipe' },
        { name: 'Calendário', href: '/dashboard/calendario' },
        // Adicione mais itens de navegação aqui
      ];

      return (
        <Box
          as="nav"
          width="200px"
          bg="gray.900"
          color="white"
          p={4}
          minH="100vh"
        >
          <VStack align="stretch" spacing={4}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              ProceSync
            </Text>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  // Estilização inline para evitar problemas com Chakra Link + NextLink
                  style={{
                    color: active ? '#63b3ed' : 'white', // Exemplo de cor ativa
                    fontWeight: active ? 'bold' : 'normal',
                    textDecoration: 'none',
                    padding: '8px 0', // Adiciona um pouco de padding para melhor clique
                    display: 'block' // Para que o padding funcione corretamente
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
          </VStack>
        </Box>
      );
    }
