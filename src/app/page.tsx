import AnimateTextStroke from '@/components/styled/AnimteTextStore';
import { route } from '@/routes';
import Link from 'next/link';

interface Props {
  href: string;
  title: string;
  description: string;
}
function GameCard({ title, description }: Props) {
  return (
    <Link href={route.game.memeAlchemy.home()}>
      <div className='rounded overflow-hidden relative p-4 border border-white/10 shadow-lg max-w-80'>
        <div className='absolute size-full top-0 right-0 bg-blue-950/80 blur-2xl'></div>
        <div className='z-10 relative'>
          <div className='text-xl'>{title}</div>
          <div className='text-white/70 '>{description}</div>
        </div>
      </div>
    </Link>
  );
}

export default function Component() {
  return (
    <main className='size-full grid-bg flex justify-center items-center'>
      <div className='container mx-auto flex flex-col justify-center items-center'>
        <AnimateTextStroke text='GameRoom' duration='3s' />

        <div className='container h-full flex flex-col items-center justify-center px-4 md:px-6 text-center z-10'>
          <h1 className='text-clamp-lg font-bold tracking-tighter text-[#206899]'>
            Multi-Player Games For Game Nights
          </h1>
          <p className='mt-4 max-w-2xl md:text-xl text-[#808080]'>
            Create a game room, invite your crew, and jump into a world of
            exciting games that are perfect for any group. No downloads, no
            fuss—just pure, unfiltered fun. Get ready to laugh, compete, and
            make memories!
          </p>
        </div>

        {/* <Link href={route.game.captionWars.home()}>
          <Button variant="contained">Caption Wars</Button>
        </Link> */}

        <div className='animated-text-gradient pt-16 pb-5 text-4xl font-bold'>
          Games
        </div>
        <div className='flex justify-center'>
          <GameCard
            href={route.game.memeAlchemy.home()}
            title='Meme Alchemy'
            description='Create the best meme by using an AI image generator to generate an image for a given caption'
          />
        </div>
      </div>
    </main>
  );
}
