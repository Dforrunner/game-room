import { number } from 'zod';

export type MemeAlchemyPlayer = {
  id: string;
  color: string;
  avatarUrl: string;
  name: string;
  score: number;
  isHost: boolean;
};

export type Caption = {
  id: string;
} & (
  | {
      top: string;
      bottom?: string;
    }
  | {
      top?: string;
      bottom: string;
    }
);

export interface PlayerRoundScore {
  points: number;
  votedBy: string;
  type: 'bonus' | 'vote';
}

export type MemeAlchemyGameState = {
  players: MemeAlchemyPlayer[];
  currentCaption: Caption;
  usedCaptionIds: string[];
  playerCaptions: Caption[];
  imageSubmissions: Record<string, string>;
  roundScores: Record<string, PlayerRoundScore[]>;
  round: number;
  maxRounds: number;
  phase: Phase;
};

export enum Phase {
  Lobby = 'lobby',
  Submission = 'submission',
  Voting = 'voting',
  Results = 'results',
  FinalResults = 'finalResults',
  GameOver = 'gameOver',
}

export enum ActionType {
  Start = 'start',
  Join = 'join',
  SubmitAvatar = 'submitAvatar',
  SubmitImage = 'submitImage',
  SubmitVote = 'submitVote',
  SubmitCaption = 'submitCaption',
  StartNextPhase = 'startNextPhase',
}
