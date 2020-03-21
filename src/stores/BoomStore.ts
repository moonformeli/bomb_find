import { action, observable } from 'mobx';
import { createContext } from 'react';

export enum ELevel {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard'
}

export default class BoomStore {
  @observable rows: number = 0;
  @observable columns: number = 0;
  @observable booms: number = 0;
  @observable time: number = 0;
  @observable isStarted: boolean = false;

  constructor(private level: ELevel) {
    if (level === ELevel.EASY) {
      this.rows = 8;
      this.columns = 8;
      this.booms = 24;
    } else if (level === ELevel.NORMAL) {
      this.rows = 12;
      this.columns = 12;
      this.booms = 80;
    } else {
      this.rows = 16;
      this.columns = 16;
      this.booms = 150;
    }
  }

  get Columns() {
    return this.columns;
  }

  get Rows() {
    return this.rows;
  }

  get Booms() {
    return this.booms;
  }

  get Time() {
    return this.time;
  }

  get IsStarted() {
    return this.isStarted;
  }

  @action.bound
  tick() {
    this.time += 1;
    setTimeout(this.tick, 1000);
  }

  @action.bound
  onGameStart() {
    this.isStarted = true;
    this.tick();
  }
}

export const BoomStoreContext = createContext<BoomStore>(null!);
