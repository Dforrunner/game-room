"use client";

import { usePlayerRoom } from "@/hooks/usePlayerRoom";

interface Props {
  username: string;
  roomId: string;
}
export default function PlayerView({ username, roomId }: Props) {
  const { playerState, dispatch } = usePlayerRoom(username, roomId);

  // Indicated that the game is loading
  if (playerState === null) {
    return (
      <p>
        <span className="transition-all w-fit inline-block mr-4 animate-bounce">
          🎲
        </span>
        Waiting for server...
      </p>
    );
  }

  const handleGuess = (event: React.SyntheticEvent) => {
    event.preventDefault();
    // Dispatch allows you to send an action!
    // Modify /game/logic.ts to change what actions you can send
    // dispatch({ type: "vote", guess: guess });
  };

  return (
    <>
      <h1 className="text-2xl border-b border-yellow-400 text-center relative">
        Hello: {playerState.username}
      </h1>
    </>
  );
}
