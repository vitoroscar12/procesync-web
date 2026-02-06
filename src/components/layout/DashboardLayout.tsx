// src/components/layout/DashboardLayout.tsx

import { ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <Flex minH="100vh" bg="gray.900">
      <Sidebar />
      <Box flex="1" ml={{ base: 0, md: '250px' }}>
        <Header />
        <Box as="main" p={4}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
