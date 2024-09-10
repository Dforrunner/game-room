import { MemeAlchemyPlayer, PlayerRoundScore } from '@/types/memeAlchemy';
import { LinearProgress } from '@mui/material';
import { useAnimate } from 'framer-motion';
import { Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import PlayerAvatar from '../PlayerAvatars/PlayerAvatar';

interface Props {
  player: MemeAlchemyPlayer;
  roundScores: PlayerRoundScore[];
}
export default function PlayerScoreCard({ player, roundScores }: Props) {
  const [pointsStar, animatePoints] = useAnimate();
  const [playerScore, setPlayerScore] = useState(player.score);
  const pointsAdded = useRef(0);

  useEffect(() => {
    setPlayerScore(player.score);

    let duration = 0;
    for (const roundScore of roundScores) {
      duration += 1500;
      setTimeout(() => {
        pointsAdded.current = roundScore.points;
        animatePoints(
          pointsStar.current,
          {
            opacity: [0, 1, 0],
            y: [10, -25, -40],
          },
          { duration: 1.5 }
        );
        setPlayerScore((prev) => prev + roundScore.points);
      }, duration);
    }
  }, [roundScores]);

  return (
    <div className='grid grid-cols-[5fr_1fr] items-center rounded-full p-3 bg-slate-200'>
      <div className='relative'>
        <LinearProgress
          variant='determinate'
          value={playerScore}
          sx={{
            height: 30,
            borderRadius: 15,
            backgroundColor: 'white',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%);',
            },
          }}
        />
        <div
          ref={pointsStar}
          className='absolute top-0 right-3 lg:-right-5 flex justify-center items-center opacity-0'
        >
          <Star
            size={60}
            stroke='#FFD700'
            fill='#FFD700'
            className='absolute'
          />
          <div className='text-white text-lg font-medium z-50'>
            {pointsAdded.current}
          </div>
        </div>
      </div>
      <div className='text-right relative flex justify-end items-center'>
        <div className='absolute size-24 rounded-full bg-slate-200 -right-6 -z-10 ' />
        <PlayerAvatar player={player} size='small' />
      </div>
    </div>
  );
}
