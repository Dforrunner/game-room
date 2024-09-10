import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { useContext } from 'react';
import GameStartBtn from '../GameStartBtn';
import RoomQr from '../RoomQr';
import { PartyType } from '@/types/gameServers';
import Players from '../PlayerAvatars/Players';

export default function Lobby() {
  const { gameState, roomId } = useContext(MemeAlchemyContext);

  return (
    <div className='h-full flex-1 flex flex-col items-center justify-center py-5'>
      <Players />
      <div className='text-2xl py-6'>
        <div>Waiting for players... ({gameState!.players.length} joined)</div>
        <div className='text-sm text-gray-400'>
          minumum 3 players required to start the game
        </div>
      </div>

      <div className='pb-3'>
        {gameState!.players.length >= 3 &&
          gameState!.players.some((p) => p.isHost) && <GameStartBtn />}
      </div>
      <RoomQr roomId={roomId} partType={PartyType.MemeAlchemy} />
    </div>
  );
}
