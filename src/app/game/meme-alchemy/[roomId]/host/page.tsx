'use client';

import { useContext } from 'react';
import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import Loading from '@/components/Loading';
import Lobby from '@/components/HostScreens/Lobby';
import SubmissionPhase from '@/components/HostScreens/SubmissionPhase';
import Voting from '@/components/SharedScreens/Voting';
import RoundResults from '@/components/SharedScreens/RoundResults';
import FinalResults from '@/components/SharedScreens/FinalResults';

export default function GameView() {
  const { gameState } = useContext(MemeAlchemyContext);

  if (!gameState) return <Loading />;

  return (
    <>
      {gameState.phase === 'lobby' && <Lobby />}
      {gameState.phase === 'submission' && <SubmissionPhase />}
      {gameState.phase === 'voting' && <Voting />}
      {gameState.phase === 'results' && <RoundResults />}
      {gameState.phase === 'finalResults' && <FinalResults />}
    </>
  );
}
