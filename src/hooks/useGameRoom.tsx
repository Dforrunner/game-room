import usePartySocket from "partysocket/react";
import { useState } from "react";
import { GameState, Action } from "../../party/game/logic";
import { PARTYKIT_HOST } from "@/env";

export const useGameRoom = (roomId: string) => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: roomId,
    query: () => ({
      viewType: "game",
    }),
    onOpen() {
      console.log("game connected");
    },
    onMessage(event: MessageEvent<string>) {
      setGameState(JSON.parse(event.data));
    },
    onClose() {
      console.log("game closed");
    },
    onError(e) {
      console.log("game error");
    },
  });

  const dispatch = (action: Action) => {
    socket.send(JSON.stringify(action));
  };

  return {
    gameState,
    dispatch,
  };
};
