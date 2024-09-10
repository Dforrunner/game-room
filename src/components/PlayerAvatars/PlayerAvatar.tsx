import { MemeAlchemyPlayer } from '@/types/memeAlchemy';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Props {
  player: MemeAlchemyPlayer;
  size?: 'small' | 'large';
}
export default function PlayerAvatar({ player, size = 'large' }: Props) {
  const sizeClassese = {
    small: 'w-[50px] h-[50px]',
    large: 'w-[40px] sm:w-[45px] md:w-[50px] lg:w-[55px] xl:w-[80px]',
  }[size];
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ rotate: 360, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 250,
        damping: 15,
        delay: Math.random() * 0.5,
      }}
      className={cn(
        ' relative h-full flex flex-col justify-center items-center',
        sizeClassese
      )}
    >
      <motion.div
        animate={{
          x: ['0%', '10%', '-10%', '0%'],
          y: ['0%', '10%', '-10%', '0%'],
          transition: {
            duration: Math.random() * 50 + 5,
            delay: Math.random() * 50,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse' as const,
          },
        }}
        className={'flex flex-col justify-center items-center gap-2'}
      >
        <div className={sizeClassese}>
          <Image
            src={player.avatarUrl}
            width={100}
            height={100}
            className='w-full h-auto'
            alt={player.name + "'s avatar"}
          />
        </div>

        <div
          className='relative font-semibold rounded-[15px] px-3 lg:px-5 text-sm lg:text-lg'
          style={{
            backgroundColor: player.color,
          }}
        >
          {player.name}
          {player.isHost && (
            <div className='absolute -top-2 -right-4 text-xs bg-yellow-200 text-gray-600 font-light px-1 rounded-[25px]'>
              Host
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
