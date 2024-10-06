'use client';

import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { useContext } from 'react';
import AiImageGenerator from '../AiImageGenerator';

export default function PlayerAiImageSubmission() {
  const { gameState, submitImage } = useContext(MemeAlchemyContext);
  return (
    <div className='flex flex-col items-center h-full'>
      <div className='px-2 text-sm text-opacity-70'>
        <div>Caption:</div>
        <h2>{gameState?.currentCaption.top}</h2>
        <h2>{gameState?.currentCaption.bottom}</h2>
      </div>

      <h1 className='text-lg p-1'>Generate your meme image</h1>
      <AiImageGenerator onImageGenerated={submitImage} />
    </div>
  );
}
