import MemeAlchemyProvider from '@/providers/MemeAlchemyProvider';

export default function MemeAlchemyPlayerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MemeAlchemyProvider>{children}</MemeAlchemyProvider>;
}
