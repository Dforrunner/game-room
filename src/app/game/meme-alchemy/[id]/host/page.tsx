'use client';

import { useParams } from 'next/navigation';
import { Button, Card, CardContent, LinearProgress } from '@mui/material';
import { useMemeAlchemy } from '@/hooks/useMemeAlchemy';

export default function GameView() {
  const { id } = useParams();
  const { gameState, startGame } = useMemeAlchemy(id as string);

  if (!gameState)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-bold text-gray-600">Loading game...</div>
      </div>
    );
console.log('gameState', gameState);
  return (
    <div className="container mx-auto p-4 h-screen flex flex-col bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-center text-primary">
        Meme Alchemy
      </h1>

      {gameState.phase === 'lobby' && (
        <Card className="flex-grow flex flex-col items-center justify-center">
          <CardContent className="text-center">
            <div className="text-2xl mb-4">
              Waiting for players... ({gameState.players.length} joined)
            </div>
            <div className="text-lg mb-4 text-gray-600">
              Game Code: <span className="font-bold">{id}</span>
            </div>
            {gameState.players.length >= 3 &&
              gameState.players.some((p) => p.isHost) && (
                <Button onClick={startGame} className="mt-4">
                  Start Game
                </Button>
              )}
          </CardContent>
        </Card>
      )}

      {(gameState.phase === 'submission' || gameState.phase === 'voting') && (
        <div className="flex-grow flex flex-col items-center justify-center">
          <Card className="w-full max-w-2xl mb-4">
            <CardContent className="p-0">
              {gameState.currentCaption}
            </CardContent>
          </Card>
          <div className="w-full max-w-2xl grid grid-cols-2 gap-4">
            {Object.entries(gameState.imageSubmissions).map(
              ([imgPlayerId, imageUrl]) => (
                <Card key={imgPlayerId}>
                  <CardContent className="p-0">
                    <img src={imageUrl} className="w-full" />
                  </CardContent>
                </Card>
              )
            )}
          </div>
          <div className="text-2xl mb-4 text-center">
            {gameState.phase === 'submission'
              ? `Submit your memes!`
              : `Vote for the best meme!`}
          </div>
          <div className="text-xl">
            Round {gameState.round} of {gameState.maxRounds}
          </div>
          <LinearProgress
            value={(gameState.round / gameState.maxRounds) * 100}
            className="w-full max-w-md mt-2"
          />
        </div>
      )}

      {gameState.phase === 'results' && (
        <Card className="flex-grow flex flex-col items-center justify-center">
          <CardContent>
            <h2 className="text-3xl font-bold mb-4 text-center">
              Final Scores
            </h2>
            {gameState.players
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <div
                  key={player.id}
                  className="text-2xl mb-2 flex justify-between items-center"
                >
                  <span>
                    {index + 1}. {player.name}
                  </span>
                  <span className="font-bold">{player.score} points</span>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {gameState.players.map((player) => (
          <Card key={player.id} className={'bg-white'}>
            <CardContent className="p-4">
              <div className="font-semibold truncate">{player.name}</div>
              <div className="text-sm text-gray-600">Score: {player.score}</div>
              {player.isHost && (
                <div className="text-xs text-blue-600">Host</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
