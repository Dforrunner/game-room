'use client';

import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { useContext, useEffect, useState } from 'react';
import PlayerScoreCard from './PlayerScoreCard';
import { Button } from '@mui/material';

export default function RoundResults() {
  const { gameState, startNextPhase } = useContext(MemeAlchemyContext);
  const [showNextRoundButton, setShowNextRoundButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNextRoundButton(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!gameState) return null;

  return (
    <div className='h-full space-y-10 pt-8'>
      {gameState.players.map((player) => (
        <PlayerScoreCard
          key={player.id + '-score-card'}
          player={player}
          roundScores={(gameState.roundScores as any)[player.id] || []}
        />
      ))}

      {showNextRoundButton && (
        <Button variant='contained' color='primary' onClick={startNextPhase}>
          Next Round
        </Button>
      )}
    </div>
  );
}
