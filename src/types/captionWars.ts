export type Player = {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
};

export type GameState = {
  players: Player[];
  currentImage: string;
  captions: { [playerId: string]: string };
  judge: string | null;
  round: number;
  maxRounds: number;
  phase: "lobby" | "submission" | "voting" | "results";
};
