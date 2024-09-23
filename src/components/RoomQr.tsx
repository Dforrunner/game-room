import { route } from '@/routes';
import { PartyType } from '@/types/gameServers';
import QRCode from 'react-qr-code';

interface Props {
  roomId: string;
  partType: PartyType;
}
export default function RoomQr({ roomId, partType }: Props) {
  const gameRoute = {
    [PartyType.MemeAlchemy]: route.game.memeAlchemy,
    [PartyType.CaptionWars]: route.game.captionWars,
  }[partType];

  return (
    <div className='border rounded p-4 space-y-3 w-64 xl:w-72 mx-auto text-center'>
      <h1 className='text-lg xl:text-xl  '>
        ROOM ID: <strong>{roomId}</strong>
      </h1>
      <div className='bg-white p-2 size-44 mx-auto xl:size-64 rounded'>
        <QRCode value={gameRoute.playerFull(roomId)} className=' size-full' />
      </div>
      <div className='text-sm lg:text-normal'>Scan QR code to join</div>
    </div>
  );
}
