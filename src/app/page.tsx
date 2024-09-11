import { route } from '@/routes';
import { Button } from '@mui/material';
import Link from 'next/link';

export default function Component() {
  return (
    <main className="flex flex-col justify-center items-center bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat min-h-screen">
      <nav className='py-4 px-6 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Welcome to the GameRoom!</h1>
      </nav>

      <div className='container h-full flex flex-col items-center justify-center px-4 md:px-6 text-center z-10'>
        <h1 className='text-5xl md:text-5xl font-bold tracking-tighter text-[#206899]'>
          Multi-Player Games For Game Nights
        </h1>
        <p className='mt-4 max-w-2xl text-lg md:text-xl text-[#808080]'>
          Create a game room, invite your crew, and jump into a world of
          exciting games that are perfect for any group. No downloads, no
          fuss—just pure, unfiltered fun. Get ready to laugh, compete, and make
          memories!
        </p>
      </div>

      <h2 className='my-2 text-gray-600'>Select a game to play:</h2>
      <div className='flex gap-3'>
        {/* <Link href={route.game.captionWars.home()}>
          <Button variant="contained">Caption Wars</Button>
        </Link> */}

        <Link href={route.game.memeAlchemy.home()}>
          <Button variant='contained'>Meme Alchemy</Button>
        </Link>
      </div>
    </main>
  );
}
