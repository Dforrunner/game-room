import type { Metadata } from 'next';
import PlayerNav from '@/components/PlayerNav';

export const metadata: Metadata = {
  title: 'Meme Alchemy - Player ',
};

export default function MemeAlchemyPlayerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='container mx-auto h-full'>
      <PlayerNav />
      <div className='h-[calc(100dvh_-_3.5rem)]'>{children}</div>
    </div>
  );
}
