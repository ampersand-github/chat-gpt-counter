import Dexie, { Table } from "dexie";

export interface Messages {
  id?: number;
  message: string;
  isGPT4: boolean;
  postAt: Date;
}

export class MySubClassedDexie extends Dexie {
  // 'Messages' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  messages!: Table<Messages>;

  constructor() {
    super("gpt-store");
    this.version(1).stores({
      messages: "++id, postAt", // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();
