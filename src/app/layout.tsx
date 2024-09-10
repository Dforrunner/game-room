import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import theme from '@/lib/theme';
import { ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from '@/lib/notistack';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Game Room',
  description: 'Awesome party games!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SnackbarProvider maxSnack={3} preventDuplicate/>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
