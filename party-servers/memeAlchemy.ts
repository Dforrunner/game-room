import { MEME_CAPTIONS } from '@/lib/memeCaptions';
import { apiRoute, route } from '@/routes';
import {
  ActionType,
  Caption,
  MemeAlchemyGameState,
  MemeAlchemyPlayer,
  Phase,
} from '@/types/memeAlchemy';
import { getRandomLightColorHex } from '@/utils/color';
import * as Party from 'partykit/server';

const MIN_PLAYERS = 1;
const VOTE_BASE_SCORE = 10;

export default class MemeAlchemyServer implements Party.Server {
  gameState: MemeAlchemyGameState;

  constructor(readonly party: Party.Room) {
    this.gameState = {
      players: [],
      currentCaption: {} as any,
      usedCaptionIds: [],
      playerCaptions: [],
      imageSubmissions: {},
      roundScores: {},
      round: 1,
      maxRounds: 5,
      phase: Phase.Lobby,
    };
  }

  onConnect(conn: Party.Connection) {
    // Send current game state to the new connection
    this.sendState(conn);
  }

  onMessage(message: string, sender: Party.Connection) {
    const data = JSON.parse(message);
    const playerId = sender.id;
    switch (data.type) {
      case ActionType.Join:
        this.addPlayer(playerId, data.name);
        break;
      case ActionType.Start:
        if (this.isHost(playerId)) this.startGame();
        break;
      case ActionType.SubmitImage:
        this.submitImage(playerId, data.imageUrl);
        break;
      case ActionType.SubmitCaption:
        this.submitCaption(data.caption);
        break;
      case ActionType.SubmitVote:
        this.submitVote(playerId, data.playerVotedFor);
        break;
      case ActionType.SubmitAvatar:
        this.submitAvatar(playerId, data.imageUrl);
        break;
      case ActionType.StartNextPhase:
        this.startNextPhase();
        break;
    }
  }

  onClose(conn: Party.Connection) {
    this.removePlayer(conn.id);
    if (this.gameState.players.length === 0) {
      this.resetToLobby();
    }
  }

  private sendState(conn: Party.Connection) {
    conn.send(JSON.stringify({ type: 'gameState', state: this.gameState }));
  }

  private broadcastState() {
    this.party.broadcast(
      JSON.stringify({ type: 'gameState', state: this.gameState })
    );
  }

  private addPlayer(id: string, name: string) {
    if (!this.gameState.players.some((p) => p.id === id)) {
      const newPlayer: MemeAlchemyPlayer = {
        id,
        name,
        avatarUrl: '',
        color: getRandomLightColorHex(),
        score: 0,
        isHost: this.gameState.players.length === 0,
      };
      this.gameState.players.push(newPlayer);
      this.broadcastState();
    }
  }

  private removePlayer(id: string) {
    const index = this.gameState.players.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.gameState.players.splice(index, 1);

      // Remove any image submissions from the removed player
      this.clearPlayerImages(id).then(console.log).catch(console.error);

      // If the removed player was the host, assign a new host
      if (
        this.gameState.players.length > 0 &&
        !this.gameState.players.some((p) => p.isHost)
      ) {
        this.gameState.players[0].isHost = true;
      }

      // If we're in the middle of a game and there aren't enough players, reset to lobby
      if (
        this.gameState.phase !== 'lobby' &&
        this.gameState.players.length < MIN_PLAYERS
      ) {
        this.resetToLobby();
      }

      this.broadcastState();
    }
  }

  private isHost(playerId: string): boolean {
    return (
      this.gameState.players.find((p) => p.id === playerId)?.isHost || false
    );
  }

  private startGame() {
    if (this.gameState.players.length < MIN_PLAYERS) {
      return; // Don't start the game with fewer than 3 players
    }
    this.gameState.round = 1;
    this.startRound();
  }

  private startRound() {
    const captions = MEME_CAPTIONS.filter(
      (c) => !this.gameState.usedCaptionIds.includes(c.id)
    );
    this.gameState.currentCaption =
      captions[Math.floor(Math.random() * captions.length)];
    this.gameState.imageSubmissions = {};
    this.gameState.phase = Phase.Submission;
    this.broadcastState();
  }

  private submitImage(playerId: string, imageUrl: string) {
    if (this.gameState.phase !== Phase.Submission) return;
    this.gameState.imageSubmissions[playerId] = imageUrl;

    if (
      Object.keys(this.gameState.imageSubmissions).length ===
      this.gameState.players.length
    ) {
      this.gameState.phase = Phase.Voting;
      this.broadcastState();
    }
  }

  private submitVote(playerId: string, playerVotedFor: string) {
    if (this.gameState.phase !== Phase.Voting) return;

    if (!this.gameState.roundScores[playerVotedFor]) {
      this.gameState.roundScores[playerVotedFor] = [];
    }
    this.gameState.roundScores[playerVotedFor].push({
      points: VOTE_BASE_SCORE,
      votedBy: playerId,
      type: 'vote',
    });

    if (
      Object.keys(this.gameState.roundScores).length ===
      this.gameState.players.length
    ) {
      if (this.gameState.round === this.gameState.maxRounds) {
        this.gameState.phase = Phase.FinalResults;
      } else {
        this.gameState.phase = Phase.Results;
      }
    }
    this.broadcastState();
  }

  private submitCaption(caption: Caption) {
    this.gameState.playerCaptions.push(caption);
    this.broadcastState();
  }

  private async submitAvatar(playerId: string, imageUrl: string) {
    this.gameState.players.find((p) => p.id === playerId)!.avatarUrl = imageUrl;
    this.broadcastState();
  }

  private startNextPhase() {
    switch (this.gameState.phase) {
      case Phase.Lobby:
        this.startGame();
        break;
      case Phase.Submission:
        this.gameState.phase = Phase.Voting;
        break;
      case Phase.Voting:
        this.gameState.phase = Phase.Results;
        break;
      case Phase.Results:
        this.gameState.round++;
        if (this.gameState.round > this.gameState.maxRounds) {
          this.gameState.phase = Phase.FinalResults;
        } else {
          this.startRound();
        }
        break;
    }
    this.broadcastState();
  }

  private async clearRoomImages() {
    await this.clearImagesByPath(
      route.game.memeAlchemy.imageFolder(this.party.id)
    );
  }

  private async clearPlayerImages(playerId: string) {
    //Clear the player's images from game state
    const playerImagePath = this.gameState.imageSubmissions[playerId];
    delete this.gameState.imageSubmissions[playerId];

    //Clear the player's images from the server
    await this.clearImagesByPath(playerImagePath);
  }

  private async clearImagesByPath(path: string) {
    if (!path) return;
    await fetch(apiRoute.image.delete(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deletePath: path }),
    });
  }

  private resetToLobby() {
    this.clearRoomImages();
    this.gameState = {
      ...this.gameState,
      currentCaption: {} as any,
      imageSubmissions: {},
      usedCaptionIds: [],
      playerCaptions: [],
      roundScores: {},
      round: 1,
      phase: Phase.Lobby,
    };
  }
}
