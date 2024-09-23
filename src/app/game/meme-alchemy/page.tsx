'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { route } from '@/routes';
import Link from 'next/link';
import { Button } from '@mui/material';
import { TextFadeIn } from '@/components/styled/TextFadeIn';

export default function Home() {
  const [gameId, setGameId] = useState('');
  const router = useRouter();

  const createGame = () => {
    const newGameId = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(route.game.memeAlchemy.host(newGameId));
  };

  const joinGame = () => {
    if (gameId) {
      router.push(route.game.memeAlchemy.player(gameId));
    }
  };

  return (
    <main className='h-screen flex flex-col gap-3 justify-center items-center'>
      <div className='p-4 border rounded border-gray-500 animated-border'>
        <h1 className='text-2xl text-center font-bold mb-3 animated-text-gradient h-10 w-[23rem]'>
          Welcome to Meme Alchemy!
        </h1>

        <div className='flex flex-col h-20 text-center'>
          <TextFadeIn
            text='Compete to generate the best image for a given'
            lineNum={2}
            className='text-white/80'
          />

          <TextFadeIn
            text='caption and create the ultimate meme!'
            lineNum={3}
            className='text-white/80'
          />
        </div>
        <button
          onClick={createGame}
          className='w-full p-2 mb-4 bg-indigo-800 text-white rounded'
        >
          Create New Game
        </button>

        <div className='flex'>
          <input
            type='text'
            value={gameId}
            onChange={(e) => setGameId(e.target.value.toUpperCase())}
            placeholder='Enter Game ID'
            className=' p-2 border rounded-l w-full text-gray-900'
          />
          <button
            onClick={joinGame}
            className='p-2 bg-indigo-800 text-white rounded-r w-32'
          >
            Join Game
          </button>
        </div>

        <div className='mt-8'>
          <Link href={route.home()} passHref>
            <Button variant='outlined' fullWidth>
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
