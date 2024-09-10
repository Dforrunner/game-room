'use client';

import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { useContext } from 'react';
import AiImageGenerator from '../AiImageGenerator';

export default function PlayerAiImageSubmission() {
  const { submitImage } = useContext(MemeAlchemyContext);
  return (
    <div className='flex flex-col items-center h-full'>
      <h1 className='text-xl p-3'>Generate your meme image</h1>
      <AiImageGenerator onImageGenerated={submitImage} />
    </div>
  );
}
