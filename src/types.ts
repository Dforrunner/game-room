export interface GameSetup {
  username?: string;
  roomId?: string;
  showGame?: boolean;
}

export interface Player {
  id: string;
  username: string;
  gameRoomId: string;
  score: number;
  userIdVotedFor?: string;
}

export interface FileUploadResponse {
  message: string;
  imageUrl: string;
}