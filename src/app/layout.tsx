// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Box } from '@chakra-ui/react'; // Importe Box para envolver o conteúdo

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProceSync',
  description: 'Plataforma de centralização de processos e distribuição de tarefas corporativas.',
  manifest: '/manifest.json', // Adiciona o manifest para PWA
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <Box id="root-content"> {/* Adiciona um ID para depuração, se necessário */}
            {children}
          </Box>
        </Providers>
      </body>
    </html>
  );
}
