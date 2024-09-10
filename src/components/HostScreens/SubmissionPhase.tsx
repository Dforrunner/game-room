'use client';

import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { LinearProgress } from '@mui/material';
import { useContext } from 'react';
import Players from '../PlayerAvatars/Players';
import CaptionCard from '../CaptionCard';
import { cn } from '@/utils/cn';

export default function SubmissionPhase() {
  const { gameState } = useContext(MemeAlchemyContext);
  if (!gameState) return null;
  
  return (
    <div className='w-full h-full flex flex-col items-center p-3'>
      <CaptionCard>
        <div
          className={cn(
            'h-64 w-full ld:min-w-[512px] bg-slate-200 flex flex-col items-center justify-center ',
            {
              'rounded-b': !gameState.currentCaption.bottom,
              'rounded-t': !gameState.currentCaption.top,
            }
          )}
        >
          <h1>Submit your memes!</h1>
          <LinearProgress
            value={(gameState.round / gameState.maxRounds) * 100}
            className='w-full max-w-md mt-5'
          />
        </div>
      </CaptionCard>
      <Players showWhenSubmitted={true} />
    </div>
  );
}
