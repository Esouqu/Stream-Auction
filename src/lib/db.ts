import Dexie, { type EntityTable } from 'dexie';
import type { ILot } from './interfaces';

const db = new Dexie('Database') as Dexie & {
  lots: EntityTable<ILot, 'id'>;
};

db.version(1).stores({
  lots: 'id, title, value',
});

export default db;