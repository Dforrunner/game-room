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
    <div className='container mx-auto'>
      <HostNav />
      <main className='h-[94dvh]'>{children}</main>
    </div>
  );
}
