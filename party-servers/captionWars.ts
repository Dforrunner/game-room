import { GameState, Player } from '@/types/captionWars';
import type * as Party from 'partykit/server';

const IMAGES = [
  'https://example.com/meme1.jpg',
  'https://example.com/meme2.jpg',
  'https://example.com/meme3.jpg',
  // Add more image URLs as needed
];

export default class MemeWarsServer implements Party.Server {
  gameState: GameState;

  constructor(readonly party: Party.Room) {
    this.gameState = {
      players: [],
      currentImage: '',
      captions: {},
      judge: null,
      round: 0,
      maxRounds: 5,
      phase: 'lobby',
    };
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // Send current game state to the new connection
    this.sendState(conn);
  }

  onMessage(message: string, sender: Party.Connection) {
    const data = JSON.parse(message);
    switch (data.type) {
      case 'join':
        this.addPlayer(sender.id, data.name);
        break;
      case 'leave':
        this.removePlayer(sender.id);
        break;
      case 'start':
        if (this.isHost(sender.id)) this.startGame();
        break;
      case 'submitCaption':
        this.submitCaption(sender.id, data.caption);
        break;
      case 'selectWinner':
        if (this.gameState.judge === sender.id)
          this.selectWinner(data.winnerId);
        break;
    }
  }

  onClose(conn: Party.Connection) {
    this.removePlayer(conn.id);
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
      const newPlayer: Player = {
        id,
        name,
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

      // If the removed player was the host, assign a new host
      if (
        this.gameState.players.length > 0 &&
        !this.gameState.players.some((p) => p.isHost)
      ) {
        this.gameState.players[0].isHost = true;
      }

      // If the removed player was the judge, assign a new judge
      if (this.gameState.judge === id && this.gameState.players.length > 0) {
        this.gameState.judge = this.gameState.players[0].id;
      }

      // If we're in the middle of a game and there aren't enough players, reset to lobby
      if (
        this.gameState.phase !== 'lobby' &&
        this.gameState.players.length < 3
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
    if (this.gameState.players.length < 3) {
      return; // Don't start the game with fewer than 3 players
    }
    this.gameState.round = 1;
    this.startRound();
  }

  private startRound() {
    this.gameState.currentImage =
      IMAGES[Math.floor(Math.random() * IMAGES.length)];
    this.gameState.judge = this.getNextJudge();
    this.gameState.captions = {};
    this.gameState.phase = 'submission';
    this.broadcastState();
  }

  private getNextJudge(): string {
    const currentJudgeIndex = this.gameState.players.findIndex(
      (p) => p.id === this.gameState.judge
    );
    const nextJudgeIndex =
      (currentJudgeIndex + 1) % this.gameState.players.length;
    return this.gameState.players[nextJudgeIndex].id;
  }

  private submitCaption(playerId: string, caption: string) {
    if (
      this.gameState.phase === 'submission' &&
      playerId !== this.gameState.judge
    ) {
      this.gameState.captions[playerId] = caption;
      if (
        Object.keys(this.gameState.captions).length ===
        this.gameState.players.length - 1
      ) {
        this.gameState.phase = 'voting';
        this.broadcastState();
      }
    }
  }

  private selectWinner(winnerId: string) {
    const winner = this.gameState.players.find((p) => p.id === winnerId);
    if (winner) {
      winner.score++;
    }
    this.gameState.round++;
    if (this.gameState.round > this.gameState.maxRounds) {
      this.gameState.phase = 'results';
    } else {
      this.startRound();
    }
    this.broadcastState();
  }

  private resetToLobby() {
    this.gameState = {
      ...this.gameState,
      currentImage: '',
      captions: {},
      judge: null,
      round: 0,
      phase: 'lobby',
    };
  }
}
