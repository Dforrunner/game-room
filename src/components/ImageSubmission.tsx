import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { useContext } from 'react';
import ImageUpload from './ImageUpload';
import { PartyType } from '@/types/gameServers';

export default function PlayerSubmission() {
  const { roomId, playerId, submitImage } = useContext(MemeAlchemyContext);
  return (
    <div className='w-full h-full flex flex-col items-center p-3'>
      <h1 className='text-xl'>Submit your meme for the caption</h1>

      <div className='h-full flex items-center justify-center'>
        <ImageUpload
          onUpload={submitImage}
          playerId={playerId}
          roomId={roomId}
          partyType={PartyType.MemeAlchemy}
        />
      </div>
    </div>
  );
}
