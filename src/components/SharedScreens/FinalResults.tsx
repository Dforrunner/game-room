'use client';

import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { useContext } from 'react';

export default function FinalResults() {
  const { gameState } = useContext(MemeAlchemyContext);

  return (
    <div className='flex-grow flex flex-col items-center justify-center'>
      <h2 className='text-3xl font-bold mb-4 text-center'>Final Scores</h2>
      {gameState!.players
        .sort((a, b) => b.score - a.score)
        .map((player) => (
          <div
            key={player.id}
            className='text-2xl grid grid-cols-2 border-b p-1'
          >
            <span> {player.name}</span>
            <span className='font-bold'> {player.score} points</span>
          </div>
        ))}
    </div>
  );
}
