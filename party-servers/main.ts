import type * as Party from 'partykit/server';

export default class MainServer implements Party.Server {
  constructor(readonly party: Party.Room) {}
  onMessage() {}
}
