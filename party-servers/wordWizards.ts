import type * as Party from "partykit/server";

type Player = {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
};

type GameState = {
  players: Player[];
  currentWord: string;
  wizard: string | null;
  clues: { [playerId: string]: string };
  guesses: { [playerId: string]: string };
  round: number;
  maxRounds: number;
  phase: "lobby" | "clue" | "guess" | "reveal" | "end";
};

const WORDS = [
  "apple",
  "beach",
  "chair",
  "dance",
  "eagle",
  "frog",
  "guitar",
  "hat",
  "island",
  "juggle",
];

export default class WordWizardsParty implements Party.Server {
  gameState: GameState;

  constructor(readonly party: Party.Party) {
    this.gameState = {
      players: [],
      currentWord: "",
      wizard: null,
      clues: {},
      guesses: {},
      round: 0,
      maxRounds: 5,
      phase: "lobby",
    };
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    this.sendState(conn);
  }

  onMessage(message: string, sender: Party.Connection) {
    const data = JSON.parse(message);
    switch (data.type) {
      case "join":
        this.addPlayer(sender.id, data.name);
        break;
      case "start":
        if (this.isHost(sender.id)) this.startGame();
        break;
      case "submitClue":
        this.submitClue(sender.id, data.clue);
        break;
      case "submitGuess":
        this.submitGuess(sender.id, data.guess);
        break;
    }
  }

  private sendState(conn: Party.Connection) {
    conn.send(JSON.stringify({ type: "gameState", state: this.gameState }));
  }

  private broadcastState() {
    this.party.broadcast(
      JSON.stringify({ type: "gameState", state: this.gameState })
    );
  }

  private addPlayer(id: string, name: string) {
    const newPlayer: Player = {
      id,
      name,
      score: 0,
      isHost: this.gameState.players.length === 0,
    };
    this.gameState.players.push(newPlayer);
    this.broadcastState();
  }

  private isHost(playerId: string): boolean {
    return (
      this.gameState.players.find((p) => p.id === playerId)?.isHost || false
    );
  }

  private startGame() {
    this.gameState.round = 1;
    this.startRound();
  }

  private startRound() {
    this.gameState.currentWord =
      WORDS[Math.floor(Math.random() * WORDS.length)];
    this.gameState.wizard =
      this.gameState.players[
        Math.floor(Math.random() * this.gameState.players.length)
      ].id;
    this.gameState.clues = {};
    this.gameState.guesses = {};
    this.gameState.phase = "clue";
    this.broadcastState();
  }

  private submitClue(playerId: string, clue: string) {
    if (this.gameState.phase === "clue" && playerId !== this.gameState.wizard) {
      this.gameState.clues[playerId] = clue;
      if (
        Object.keys(this.gameState.clues).length ===
        this.gameState.players.length - 1
      ) {
        this.gameState.phase = "guess";
        this.broadcastState();
      }
    }
  }

  private submitGuess(playerId: string, guess: string) {
    if (
      this.gameState.phase === "guess" &&
      playerId !== this.gameState.wizard
    ) {
      this.gameState.guesses[playerId] = guess;
      if (
        Object.keys(this.gameState.guesses).length ===
        this.gameState.players.length - 1
      ) {
        this.scoreRound();
      }
    }
  }

  private scoreRound() {
    const correctGuessers = Object.entries(this.gameState.guesses)
      .filter(
        ([_, guess]) =>
          guess.toLowerCase() === this.gameState.currentWord.toLowerCase()
      )
      .map(([playerId, _]) => playerId);

    // Award points to correct guessers and their clue givers
    correctGuessers.forEach((guesserId) => {
      const guesser = this.gameState.players.find((p) => p.id === guesserId);
      if (guesser) guesser.score += 2;

      Object.entries(this.gameState.clues).forEach(([clueGiverId, clue]) => {
        if (
          clue.toLowerCase().includes(this.gameState.currentWord.toLowerCase())
        )
          return; // Disqualify if clue contains the word
        const clueGiver = this.gameState.players.find(
          (p) => p.id === clueGiverId
        );
        if (clueGiver) clueGiver.score += 1;
      });
    });

    // Award points to the wizard if no one guessed correctly
    if (correctGuessers.length === 0) {
      const wizard = this.gameState.players.find(
        (p) => p.id === this.gameState.wizard
      );
      if (wizard) wizard.score += 3;
    }

    this.gameState.phase = "reveal";
    this.broadcastState();

    // Start next round or end game
    setTimeout(() => {
      this.gameState.round++;
      if (this.gameState.round > this.gameState.maxRounds) {
        this.gameState.phase = "end";
      } else {
        this.startRound();
      }
      this.broadcastState();
    }, 5000);
  }
}
