import HostNav from '@/components/HostNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meme Alchemy - Game ',
};

export default function MemeAlchemyPlayerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='container mx-auto h-screen'>
      <HostNav />
      <main className='h-[calc(100dvh_-_3.5rem)]'>{children}</main>
    </div>
  );
}
