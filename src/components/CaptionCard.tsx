'use client';
import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { Phase } from '@/types/memeAlchemy';
import { cn } from '@/utils/cn';
import { useContext } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
export default function CaptionCard({
  children,
  className,
  onClick = () => {},
}: Props) {
  const { gameState } = useContext(MemeAlchemyContext);
  if (!gameState?.currentCaption) return null;
  const { top, bottom } = gameState?.currentCaption;

  const textClass =
    'text-white font-medium text-center w-full  bg-gray-600 px-1 py-2 ';
  const conditionalClass = {
    'text-lg md:text-3xl lg:text-5xl 2xl:text-6xl':
      gameState.phase === Phase.Submission,
  };
  return (
    <div className='shadow-md rounded overflow-hidden' onClick={onClick}>
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
