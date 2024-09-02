'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import usePartySocket from 'partysocket/react';
import { PARTYKIT_HOST } from '@/env';
import { Button } from '@mui/material';

type Player = {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
};

type GameState = {
  players: Player[];
  currentImage: string;
  captions: { [playerId: string]: string };
  judge: string;
  round: number;
  maxRounds: number;
  phase: 'lobby' | 'submission' | 'voting' | 'results';
};
export default function PlayerView() {
  const { id } = useParams<{ id: string }>();
  const [gameState, setGameState] = useState<GameState>();
  const [playerName, setPlayerName] = useState('');
  const [caption, setCaption] = useState('');
  const [playerId, setPlayerId] = useState<string>();

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: id,
    party: 'captionwars',
    onMessage(event) {
      const data = JSON.parse(event.data);
      if (data.type === 'gameState') {
        setGameState(data.state);
      }
    },
  });

  const joinGame = () => {
    setPlayerId(socket.id);
    socket.send(JSON.stringify({ type: 'join', name: playerName }));
  };

  const startGame = () => {
    socket.send(JSON.stringify({ type: 'start' }));
  };

  const submitCaption = () => {
    socket.send(JSON.stringify({ type: 'submitCaption', caption }));
    setCaption('');
  };

  const selectWinner = (winnerId: string) => {
    socket.send(JSON.stringify({ type: 'selectWinner', winnerId }));
  };

  if (!gameState)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  const player = gameState.players.find((p) => p.id === playerId);

  console.log({ gameState, playerId, socketId: socket.id });
  console.log({ player });
  if (!player) {
    return (
      <div className="container mx-auto p-4 h-screen flex flex-col items-center justify-center">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
          className="w-full max-w-xs p-2 mb-4 border rounded"
        />
        <Button
          onClick={joinGame}
          className="w-full max-w-xs p-2 bg-blue-500 text-white rounded"
          variant="contained"
        >
          Join Game
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">
        What Do You Meme? - Player View
      </h1>
      {gameState.phase === 'lobby' && player.isHost && (
        <button
          onClick={startGame}
          className="w-full p-2 mb-4 bg-green-500 text-white rounded"
        >
          Start Game
        </button>
      )}
      {gameState.phase === 'submission' && gameState.judge !== player.id && (
        <div className="flex-grow flex flex-col items-center justify-center">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter your caption"
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            onClick={submitCaption}
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            Submit Caption
          </button>
        </div>
      )}
      {gameState.phase === 'voting' && gameState.judge === player.id && (
        <div className="flex-grow flex flex-col items-center justify-center">
          <h2 className="text-xl mb-4">Choose the best caption:</h2>
          {Object.entries(gameState.captions).map(([playerId, caption]) => (
            <button
              key={playerId}
              onClick={() => selectWinner(playerId)}
              className="w-full p-2 mb-2 bg-gray-200 text-left rounded hover:bg-gray-300"
            >
              {caption}
            </button>
          ))}
        </div>
      )}
      {((gameState.phase === 'submission' && gameState.judge === player.id) ||
        (gameState.phase === 'voting' && gameState.judge !== player.id)) && (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-xl">
            {gameState.phase === 'submission'
              ? 'Wait for players to submit captions...'
              : 'Wait for the judge to choose...'}
          </div>
        </div>
      )}
      {gameState.phase === 'results' && (
        <div className="flex-grow flex flex-col items-center justify-center">
          <h2 className="text-2xl mb-4">Game Over!</h2>
          <div className="text-xl mb-2">Your score: {player.score}</div>
          <div className="text-lg">
            Wait for the host to start a new game...
          </div>
        </div>
      )}
      <div className="mt-4">
        <div className="text-lg">You are: {player.name}</div>
        <div className="text-lg">
          Round: {gameState.round} / {gameState.maxRounds}
        </div>
      </div>
    </div>
  );
}
