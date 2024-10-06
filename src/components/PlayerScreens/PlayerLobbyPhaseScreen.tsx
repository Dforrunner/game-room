import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { useContext } from 'react';
import GameStartBtn from '../GameStartBtn';

export default function PlayerLobbyPhaseScreen() {
  const { gameState, player } = useContext(MemeAlchemyContext);
  return (
    <div>
      {player?.isHost && <div>You are the Host!</div>}
      {gameState!.players.length < 3 && (
        <>
          <div>Waiting for players... ({gameState!.players.length} joined)</div>
          <div>minumum 3 players required to start the game</div>
        </>
      )}

      <div className='flex justify-center'>
        {gameState!.players.length >= 3 && player!.isHost && <GameStartBtn />}
      </div>
      {gameState!.players.length >= 3 && !player!.isHost && (
        <div>Waiting for the host to start the game</div>
      )}
    </div>
  );
}
