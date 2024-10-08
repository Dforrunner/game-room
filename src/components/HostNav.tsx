'use client';
import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { Phase } from '@/types/memeAlchemy';
import { useContext } from 'react';

export default function HostNav() {
  const { gameState } = useContext(MemeAlchemyContext);

  return (
    <nav className='h-14 grid grid-cols-2 p-2'>
      <h1 className='font-bold text-2xl'>Meme Alchemy</h1>
      {gameState && gameState.phase !== Phase.Lobby && (
        <div className='text-right pr-5 text-gray-200'>
          <div>
            Round: {gameState.round} / {gameState.maxRounds}
          </div>
          <div>Players: {gameState.players.length}</div>
        </div>
      )}
    </nav>
  );
}
