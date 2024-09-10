import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { Button, TextField } from '@mui/material';
import { useContext, useState } from 'react';

export default function PlayerJoinForm() {
  const [playerName, setPlayerName] = useState('');
  const { joinGame } = useContext(MemeAlchemyContext);
  const [error, setError] = useState('');

  const handleJoinGame = () => {
    if (playerName.length < 2) {
      setError('Player name must be at least 2 characters.');
      return;
    }
    if (playerName.length > 15) {
      setError('Player name cannot exceed 15 characters.');
      return;
    }

    joinGame(playerName);
  };

  const handleUsernameChange = (e: any) => {
    const val = e.target.value;
    if (error) setError('');

    if (val.length > 15) {
      setError('Player name cannot exceed 15 characters.');
    }

    setPlayerName(val);
  };
  return (
    <div className='mx-auto p-4 h-screen flex flex-col items-center justify-center bg-slate-50'>
      <div className='flex flex-col items-center gap-3 border rounded p-5 shadow bg-white'>
        <h2 className='text-xl'>Meme Alchemy Game Room</h2>
        <p className='text-gray-500 py-2'>
          Enter your player name to join the game
        </p>
        <TextField
          label='Player Name'
          fullWidth
          autoComplete='off'
          value={playerName}
          onChange={handleUsernameChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleJoinGame();
          }}
          placeholder='Enter your player name'
          error={Boolean(error)}
          helperText={error}
        />
        <Button
          onClick={handleJoinGame}
          className='w-full max-w-xs p-2 bg-blue-500 text-white rounded'
          variant='contained'
        >
          Join Game
        </Button>
      </div>
    </div>
  );
}
