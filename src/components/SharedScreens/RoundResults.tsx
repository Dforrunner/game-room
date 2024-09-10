'use client';

import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { useContext } from 'react';
import PlayerScoreCard from './PlayerScoreCard';

export default function RoundResults() {
  const { gameState } = useContext(MemeAlchemyContext);
  if (!gameState) return null;
  
  return (
    <div className='h-full space-y-7'>
      {gameState.players.map((player) => (
        <PlayerScoreCard
          key={player.id + '-score-card'}
          player={player}
          roundScores={(gameState.roundScores as any)[player.id]}
        />
      ))}
    </div>
  );
}
