import type { Metadata } from 'next';
import MemeAlchemyProvider from '@/providers/MemeAlchemyProvider';

export const metadata: Metadata = {
  title: 'Meme Alchemy',
  description: 'Meme Alchemy - a game of creativity and fun',
};

export default function MemeAlchemyPlayerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className='grid-bg'>{children}</div>;
}
