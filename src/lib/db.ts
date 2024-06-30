import Dexie, { type Table } from 'dexie';
import type { ILot } from './interfaces';

class Database extends Dexie {
  readonly lots!: Table<ILot>;

  constructor() {
    super('Database');
    this.version(1).stores({
      lots: 'id, title, value, color, contrastColor, donators, url, percent',
    });
  }
}

const db = new Database();

export default db;