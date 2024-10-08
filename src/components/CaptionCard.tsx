'use client';
import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { Phase } from '@/types/memeAlchemy';
import { cn } from '@/utils/cn';
import { useContext, useState } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  isPlayerScreen?: boolean;
}
export default function CaptionCard({
  children,
  className,
  onClick,
  selected,
  isPlayerScreen = false,
}: Props) {
  const { gameState } = useContext(MemeAlchemyContext);
  if (!gameState?.currentCaption) return null;
  const { top, bottom } = gameState?.currentCaption;

  const textClass =
    'text-white font-medium text-center w-full bg-indigo-950 px-1 py-2';
  const conditionalClass = {
    ' card-caption-text-camp':
      gameState.phase === Phase.Submission && !isPlayerScreen,
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={cn(
        'container relative shadow-lg rounded overflow-hidden flex flex-col items-center justify-center',
        {
          'border-4 border-blue-500': selected,
          'size-[512px]': isPlayerScreen,
        }
      )}
      onClick={handleClick}
    >
      {selected && (
        <div className='bg-blue-700 bg-opacity-50 absolute top-0 right-0 size-full flex flex-col justify-center text-shadow items-center text-white text-xl font-bold'>
          <div>Your vote is submitted!</div>
          <div className='text-sm'>Sit tight while others vote</div>
        </div>
      )}
      <div className={cn(textClass, conditionalClass, className)}>{top}</div>
      {children}
      {bottom && (
        <div className={cn(textClass, conditionalClass, className)}>
          {bottom}
        </div>
      )}
    </div>
  );
}
