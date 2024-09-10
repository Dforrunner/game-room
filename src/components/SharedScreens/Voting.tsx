import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { useContext } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import CaptionCard from '../CaptionCard';

interface Props {
  isPlayerView?: boolean;
}
export default function Voting({ isPlayerView = false }: Props) {
  const { gameState, submitVote } = useContext(MemeAlchemyContext);
  const numberOfSubmission = Object.keys(gameState!.imageSubmissions).length;

  const handleClick = (imgPlayerId: string) => {
    if (isPlayerView) {
      submitVote(imgPlayerId);
    }
  };

  return (
    <div className='h-full mx-auto'>
      <h1 className='text-2xl font-bold text-center'>
        Vote for the best meme!
      </h1>

      <div
        className={cn(
          'w-full py-5 grid gap-4 overflow-hidden px-3',
          {
            'xl:grid-cols-3': numberOfSubmission <= 6,
            'xl:grid-cols-4': numberOfSubmission > 6 && numberOfSubmission <= 8,
            'xl:grid-cols-5':
              numberOfSubmission > 8 && numberOfSubmission <= 10,
            'xl:grid-cols-6': numberOfSubmission > 10,
          },
          {
            'cursor-pointer': isPlayerView,
          }
        )}
      >
        {Object.entries(gameState!.imageSubmissions).map(
          ([imgPlayerId, imageUrl]) => (
            <CaptionCard
              key={imgPlayerId}
              onClick={() => handleClick(imgPlayerId)}
            >
              <Image
                src={imageUrl}
                width={300}
                height={300}
                className='w-full h-auto'
                alt={'Img Option'}
              />
            </CaptionCard>
          )
        )}
      </div>
    </div>
  );
}
