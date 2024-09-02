export type MemeAlchemyPlayer = {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
};

export type MemeAlchemyGameState = {
  players: MemeAlchemyPlayer[];
  currentCaption: string;
  usedCaptions: string[];
  playerCaptions: string[];
  imageSubmissions: { [playerId: string]: string };
  round: number;
  maxRounds: number;
  phase: 'lobby' | 'submission' | 'voting' | 'results';
};

export enum ActionType {
  Start = 'start',
  Join = 'join',
  SubmitImage = 'submitImage',
  SubmitVote = 'submitVote',
  SubmitCaption = 'submitCaption',
}
