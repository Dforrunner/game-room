import { MEME_CAPTIONS } from '@/lib/memeCaptions';
import { getRandomLightColorHex } from './color';
import { Phase } from '@/types/memeAlchemy';

export const testMemeAlchemyGameState = () => {
  const playerIds = [
    '1',
    '2',
    // '3',
    // '4',
    // '5',
    // '6',
    // '7',
    // '8',
    // '9',
    // '10',
    // '11',
    // '12',
    // '13',
    // '14',
    // '15',
    // '16',
  ];
  return {
    gameState: {
      players: playerIds.map((p, index) => ({
        id: p,
        avatarUrl: `/uploads/memealchemy/7P2X4W/avatars/${
          Number(p) % 2 ? '1' : '4'
        }.webp`,
        name: Number(p) % 2 === 1 ? 'mo' : 'jo',
        score: 0,
        isHost: index === 0,
        color: getRandomLightColorHex(),
      })),
      currentCaption: MEME_CAPTIONS[0],
      usedCaptionsIds: [],
      roundScores: {
        '1': [
          { points: 10, votedBy: '2', type: 'vote' },
          { points: 5, votedBy: '3', type: 'bonus' },
          { points: 15, votedBy: '4', type: 'vote' },
          { points: 20, votedBy: '5', type: 'vote' },
        ],
        '2': [
          { points: 5, votedBy: '2', type: 'vote' },
          { points: 10, votedBy: '3', type: 'bonus' },
          { points: 15, votedBy: '4', type: 'vote' },
          { points: 4, votedBy: '5', type: 'vote' },
        ],
      },
      playerCaptions: [],
      imageSubmissions: {
        '1': '/bg.jpg',
        '2': '/bg.jpg',
        '3': '/bg.jpg',
        '4': '/bg.jpg',
      },
      round: 1,
      maxRounds: 5,
      phase: Phase.Voting,
    },
    playerId: '1',
    roomId: '1234',
    player: {
      id: '1',
      avatarUrl: '/uploads/memealchemy/7P2X4W/avatars/1.webp',
      name: 'mo',
      score: 0,
      isHost: true,
      color: '#ffffff',
    },
    startGame: () => {},
    joinGame: () => {},
    submitImage: () => {},
    submitVote: () => {},
    submitAvatar: () => {},
    startNextPhase: () => {},
  };
};
