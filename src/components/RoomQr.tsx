import { route } from '@/routes';
import { PartyType } from '@/types/gameServers';
import QRCode from 'react-qr-code';

interface Props {
  roomId: string;
  partType: PartyType;
}
export default function RoomQr({ roomId, partType }: Props) {
  const gameRoue = {
    [PartyType.MemeAlchemy]: route.game.memeAlchemy,
    [PartyType.CaptionWars]: route.game.captionWars,
  }[partType];

  return (
    <div className='border rounded p-4 space-y-3 w-44 md:w-48 xl:w-[220px] mx-auto text-center'>
      <h1 className='text-lg xl:text-xl  '>
        ROOM ID: <strong>{roomId}</strong>
      </h1>
      <QRCode
        value={gameRoue.player(roomId)}
        className='mx-auto w-32 h-32 md:w-40 md:h-40 xl:h-50 xl:w-50 '
      />
      <div className='text-sm lg:text-normal'>Scan QR code to join</div>
    </div>
  );
}
