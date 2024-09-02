import usePartySocket from "partysocket/react";
import { useState } from "react";
import { Action } from "../../party/game/logic";
import { PARTYKIT_HOST } from "@/env";
import { Player } from "@/types";

export const usePlayerRoom = (username: string, roomId: string) => {
  const [playerState, setPlayerState] = useState<Player | null>(null);

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: roomId,
    query: () => ({
      viewType: "player",
      username
    }),
    onOpen() {
      console.log("player connected");
    },
    onMessage(event: MessageEvent<string>) {
      setPlayerState(JSON.parse(event.data));
    },
    onClose() {
      console.log("player closed");
    },
    onError(e) {
      console.log("player error");
    },
  });

  const dispatch = (action: Action) => {
    socket.send(JSON.stringify(action));
  };

  return {
    playerState,
    dispatch,
  };
};
