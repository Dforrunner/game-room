import { PARTYKIT_HOST } from '@/env';
import { PartyType } from '@/types/gameServers';
import { ActionType, MemeAlchemyGameState } from '@/types/memeAlchemy';
import { useParams } from 'next/navigation';
import usePartySocket from 'partysocket/react';
import { useMemo, useState } from 'react';

export const useMemeAlchemy = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [gameState, setGameState] = useState<MemeAlchemyGameState>();

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: roomId,
    party: PartyType.MemeAlchemy,
    onMessage(event: MessageEvent<string>) {
      const data = JSON.parse(event.data as string);
      if (data.type === 'gameState') {
        setGameState(data.state);
      }
    },
  });

  const playerId = useMemo(() => socket.id, [socket.id]);
  const player = gameState?.players.find((p) => p.id === playerId);

  const dispatch = (actionType: ActionType, payload?: Record<string, any>) => {
    socket.send(JSON.stringify({ type: actionType, ...payload }));
  };
  const startGame = () => {
    dispatch(ActionType.Start);
  };

  const joinGame = (name: string) => {
    if (!name) return;
    // setPlayerId(socket.id);
    dispatch(ActionType.Join, { name });
  };

  const submitImage = (imageUrl: string) => {
    dispatch(ActionType.SubmitImage, { imageUrl });
  };

  const submitVote = (playerVotedFor: string) => {
    dispatch(ActionType.SubmitVote, { playerVotedFor });
  };

  const submitAvatar = (imageUrl: string) => {
    dispatch(ActionType.SubmitAvatar, { imageUrl });
  };

  const startNextPhase = () => {
    dispatch(ActionType.StartNextPhase);
  };

  return {
    gameState,
    playerId,
    roomId,
    player,
    startGame,
    joinGame,
    submitImage,
    submitVote,
    submitAvatar,
    startNextPhase,
  };
};
