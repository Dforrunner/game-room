import { imageUpload } from '@/utils/fileUpload';
import DrawingPad from '../Art/DrawingPad';
import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { useContext } from 'react';
import { PartyType } from '@/types/gameServers';
import { errorSnackBar } from '@/utils/snackBars';

export default function AvatarSubmission() {
  const { submitAvatar, playerId, roomId } = useContext(MemeAlchemyContext);

  const handleSubmit = async (avaterImage: File) => {
    try {
      const res = await imageUpload({
        file: avaterImage,
        playerId,
        roomId,
        partyType: PartyType.MemeAlchemy,
        isAvatar: true,
      });

      submitAvatar(res.imageUrl);
    } catch (error) {
      errorSnackBar('Failed to submit avatar. Try again.');
    }
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <h1 className='text-xl'>Draw your avatar</h1>
      <DrawingPad onSubmit={handleSubmit} />
    </div>
  );
}
