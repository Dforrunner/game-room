import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { Button } from '@mui/material';
import { useContext } from 'react';

export default function GameStartBtn() {
  const { gameState, startGame } = useContext(MemeAlchemyContext);
  if(!gameState) return null;
  const canStartGame =
    gameState.players.filter((p) => !!p.avatarUrl).length >= 3;
  return (
    <Button
      className='w-full max-w-xs p-2 bg-green-500 text-white rounded'
      fullWidth
      variant='contained'
      color='success'
      onClick={startGame}
      disabled={!canStartGame}
    >
      Start Game
    </Button>
  );
}
