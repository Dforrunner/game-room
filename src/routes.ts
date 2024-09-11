import { PartyType } from './types/gameServers';
import { routeGen } from './utils/routeGenerator';

export enum Route {
  Home = '/',
  Game = '/game',
}

export enum GameRoute {
  CaptionWars = Route.Game + '/caption-wars',
  MemeAlchemy = Route.Game + '/meme-alchemy',
}

export const route = {
  home: () => routeGen(Route.Home),
  game: {
    captionWars: {
      home: () => routeGen(GameRoute.CaptionWars),
      host: (roomId: string) =>
        routeGen(GameRoute.CaptionWars + `/${roomId}/host`),
      player: (roomId: string) =>
        routeGen(GameRoute.CaptionWars + `/${roomId}/player`),
    },
    memeAlchemy: {
      home: () => routeGen(GameRoute.MemeAlchemy),
      host: (roomId: string) =>
        routeGen(GameRoute.MemeAlchemy + `/${roomId}/host`),
      player: (roomId: string) =>
        routeGen(GameRoute.MemeAlchemy + `/${roomId}/player`),
      imageFolder: (roomId: string) =>
        `/${PartyType.MemeAlchemy}/${roomId}`,
    },
  },
};

export const apiRoute = {
  image: {
    upload: () => routeGen('/api/image/upload'),
    delete: () => routeGen('/api/image/delete'),
  },
};
