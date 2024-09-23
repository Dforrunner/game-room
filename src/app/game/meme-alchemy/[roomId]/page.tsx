import { route } from '@/routes';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: {
    roomId: string;
  };
}
export default function MemeAlchemyBasePage({ params }: Props) {
  if (params.roomId) {
    redirect(route.game.memeAlchemy.player(params.roomId));
  } else {
    notFound();
  }
}
