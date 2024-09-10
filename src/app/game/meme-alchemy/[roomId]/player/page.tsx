'use client';

import Loading from '@/components/Loading';
import PlayerJoinForm from '@/components/PlayerJoinForm';
import AvatarSubmission from '@/components/PlayerScreens/AvatarSubmission';
import Voting from '@/components/SharedScreens/Voting';
import { useContext } from 'react';
import { MemeAlchemyContext } from '@/providers/MemeAlchemyProvider';
import PlayerAiImageSubmission from '@/components/PlayerScreens/PlayerAiImageSubmission';
import RoundResults from '@/components/SharedScreens/RoundResults';
import FinalResults from '@/components/SharedScreens/FinalResults';
import PlayerLobbyPhaseScreen from '@/components/PlayerScreens/PlayerLobbyPhaseScreen';

export default function PlayerView() {
  const { gameState, player } = useContext(MemeAlchemyContext);

  if (!gameState) return <Loading />;
  if (!player) return <PlayerJoinForm />;
  if (!player.avatarUrl) return <AvatarSubmission />;

  return (
    <div className='container mx-auto p-4 h-screen flex flex-col'>
      {gameState.phase === 'lobby' && <PlayerLobbyPhaseScreen />}
      {gameState.phase === 'submission' && <PlayerAiImageSubmission />}
      {gameState.phase === 'voting' && <Voting isPlayerView={true} />}
      {gameState.phase === 'results' && <RoundResults />}
      {gameState.phase === 'finalResults' && <FinalResults />}
    </div>
  );
}
