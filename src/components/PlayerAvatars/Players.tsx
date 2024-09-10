'use client';

import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { useContext } from 'react';
import PlayerAvatar from './PlayerAvatar';
import { cn } from '@/utils/cn';

interface Props {
  showWhenSubmitted?: boolean;
}
export default function Players({ showWhenSubmitted = false }: Props) {
  const { gameState } = useContext(MemeAlchemyContext);

  if (!gameState) return null;
  const players = gameState.players.filter((p) => !!p.avatarUrl);
  return (
    <div
      className={cn(
        'w-full min-h-[180px] px-12 grid gap-4  ',
        {
          'grid-cols-2': players.length <= 4,
          'grid-cols-3': players.length > 4 && players.length <= 6,
          'grid-cols-4': players.length > 6 && players.length <= 8,
          'grid-cols-5': players.length > 8 && players.length <= 10,
          'grid-cols-6': players.length > 10 && players.length <= 12,
          'grid-cols-7': players.length > 12 && players.length <= 14,
          'grid-cols-8': players.length > 14 && players.length <= 16,
        }
      )}
    >
      {players.map((player) =>
        !showWhenSubmitted ||
        (showWhenSubmitted &&
          !!(gameState.imageSubmissions as any)[player.id]) ? (
          <PlayerAvatar key={player.id} player={player} />
        ) : undefined
      )}
    </div>
  );
}
