'use client';

import { useParams } from 'next/navigation';
import { Button, Card, CardContent } from '@mui/material';
import { useMemeAlchemy } from '@/hooks/useMemeAlchemy';
import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import { PartyType } from '@/types/gameServers';

export default function PlayerView() {
  const { id } = useParams<{ id: string }>();
  const [playerName, setPlayerName] = useState('');
  const {
    gameState,
    startGame,
    joinGame,
    submitImage,
    submitVote,
    playerId,
    player,
  } = useMemeAlchemy(id as string);

  if (!gameState)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  if (!player) {
    return (
      <div className="container mx-auto p-4 h-screen flex flex-col items-center justify-center">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') joinGame(playerName);
          }}
          placeholder="Enter your name"
          className="w-full max-w-xs p-2 mb-4 border rounded"
        />
        <Button
          onClick={() => joinGame(playerName)}
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
      <h1 className="text-2xl font-bold mb-4">Meme Alchemy</h1>
      {gameState.phase === 'lobby' && player.isHost && (
        <button
          onClick={startGame}
          className="w-full p-2 mb-4 bg-green-500 text-white rounded"
        >
          Start Game
        </button>
      )}

      {gameState.phase === 'submission' && (
        <div className="flex-grow flex flex-col items-center justify-center">
          <ImageUpload
            onUpload={submitImage}
            playerId={playerId}
            roomId={id}
            party={PartyType.MemeAlchemy}
          />
        </div>
      )}
      {gameState.phase === 'voting' && (
        <div className="flex-grow flex flex-col items-center justify-center">
          <h2 className="text-xl mb-4">Choose the best meme:</h2>
          {Object.entries(gameState.imageSubmissions).map(
            ([imgPlayerId, imageUrl]) =>
              imgPlayerId === playerId ? undefined : (
                <Card key={imgPlayerId} onClick={() => submitVote(imgPlayerId)}>
                  <CardContent className="p-0">
                    <img src={imageUrl} className="w-full" />
                  </CardContent>
                </Card>
              )
          )}
        </div>
      )}
      {(gameState.phase === 'submission' || gameState.phase === 'voting') && (
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
