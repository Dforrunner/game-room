'use client';
import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import { getContrastingColor } from '@/utils/color';
import { Avatar } from '@mui/material';
import { useContext } from 'react';
import { Phase } from '@/types/memeAlchemy';

export default function Nav() {
  const { player, gameState } = useContext(MemeAlchemyContext);
  if (!gameState) return null;
  const title = (
    {
      [Phase.Voting]: 'Vote for the best meme!',
      [Phase.Results]: 'Round Results',
      [Phase.FinalResults]: 'Final Results',
    } as any
  )[gameState?.phase];

  return (
    <nav className='h-[6dvh] px-3 grid grid-cols-3 justify-between items-center pt-2'>
      <div />
      {/* <h1 className='font-bold'>Meme Alchemy</h1> */}
      <div className='text-center w-full'>{title}</div>
      {player && (
        <div className='flex justify-end'>
          <Avatar
            sx={{
              backgroundColor: player.color,
              color: getContrastingColor(player.color),
            }}
          >
            {player.name[0].toLocaleUpperCase()}
          </Avatar>
        </div>
      )}
    </nav>
  );
}
