'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { route } from '@/routes';
import Link from 'next/link';
import { Button } from '@mui/material';

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
    <div className="h-screen flex flex-col gap-3 justify-center items-center">
      <div className="p-4 border rounded border-gray-500">
        <h1 className="text-3xl text-center font-bold mb-8">
          Welcome to Meme Alchemy!
        </h1>
        <button
          onClick={createGame}
          className="w-full p-2 mb-4 bg-blue-500 text-white rounded"
        >
          Create New Game
        </button>
        <div className="flex">
          <input
            type="text"
            value={gameId}
            onChange={(e) => setGameId(e.target.value.toUpperCase())}
            placeholder="Enter Game ID"
            className=" p-2 border rounded-l w-full"
          />
          <button
            onClick={joinGame}
            className="p-2 bg-green-500 text-white rounded-r w-32"
          >
            Join Game
          </button>
        </div>
      </div>

      <Link href={route.home()} passHref>
        <Button variant="outlined">Back to home</Button>
      </Link>
    </div>
  );
}
