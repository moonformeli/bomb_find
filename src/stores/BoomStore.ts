import { action, computed, observable, toJS } from 'mobx';
import { createContext } from 'react';

export enum ELevel {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard'
}

const BOOM = -1;
const WALL = -Infinity;

export default class BoomStore {
  @observable rows: number = 0;
  @observable columns: number = 0;
  @observable booms: number = 0;
  @observable time: number = 0;
  @observable board: number[][] = []; /* 지뢰 기록 배열 */
  @observable visited: number[][] = []; /* 방문 여부 기록 배열 */
  @observable displayMap: number[][] = []; /* 보여주기 여부 결정 배열 */
  @observable isStarted: boolean = false;

  constructor(level: ELevel) {
    if (level === ELevel.EASY) {
      this.rows = 8;
      this.columns = 8;
      this.booms = 25;
    } else if (level === ELevel.NORMAL) {
      this.rows = 12;
      this.columns = 12;
      this.booms = 60;
    } else {
      this.rows = 20;
      this.columns = 20;
      this.booms = 90;
    }

    this.initBoard();
  }

  @action.bound
  private initBoard(): void {
    /* row, column 보다 한 겹 더 둘러서 만든다 */
    for (let i = 0; i < this.rows + 2; i += 1) {
      this.board[i] = [];
      this.visited[i] = [];
      this.displayMap[i] = [];
      for (let j = 0; j < this.columns + 2; j += 1) {
        this.board[i].push(WALL);
        this.visited[i].push(WALL);
        this.displayMap[i].push(WALL);
      }
    }

    /* 지뢰찾기 cells 생성 */
    for (let i = 1; i <= this.rows; i += 1) {
      for (let j = 1; j <= this.columns; j += 1) {
        this.board[i][j] = 0;
        this.visited[i][j] = 0;
        this.displayMap[i][j] = 0;
      }
    }

    /* 지뢰를 랜덤하게 심기 */
    let bombs = this.booms;
    while (bombs) {
      const randomRow = Math.floor(Math.random() * this.rows);
      const randomCol = Math.floor(Math.random() * this.columns);

      if (this.board[randomRow][randomCol] === 0) {
        this.board[randomRow][randomCol] = BOOM;
        bombs -= 1;
      }
    }

    /* 인접한 칸에 지뢰가 몇 개 있는지 조사 */
    for (let i = 1; i <= this.rows; i += 1) {
      for (let j = 1; j <= this.columns; j += 1) {
        if (this.board[i][j] < 0) {
          continue;
        }

        /* 인접한 8칸을 조사 */
        if (this.board[i - 1][j - 1] === BOOM) this.board[i][j] += 1;
        if (this.board[i][j - 1] === BOOM) this.board[i][j] += 1;
        if (this.board[i + 1][j - 1] === BOOM) this.board[i][j] += 1;
        if (this.board[i - 1][j] === BOOM) this.board[i][j] += 1;
        if (this.board[i + 1][j] === BOOM) this.board[i][j] += 1;
        if (this.board[i - 1][j + 1] === BOOM) this.board[i][j] += 1;
        if (this.board[i][j + 1] === BOOM) this.board[i][j] += 1;
        if (this.board[i + 1][j + 1] === BOOM) this.board[i][j] += 1;
      }
    }
    console.log(toJS(this.board));
  }

  get Columns(): number {
    return this.columns;
  }

  get Rows(): number {
    return this.rows;
  }

  get Booms(): number {
    return this.booms;
  }

  get Time(): number {
    return this.time;
  }

  get IsStarted(): boolean {
    return this.isStarted;
  }

  shouldShowCell(row: number, column: number): boolean {
    return this.displayMap[row][column] > 0;
  }

  @action.bound
  tick(): void {
    this.time += 1;
    setTimeout(this.tick, 1000);
  }

  @action.bound
  onGameStart(): void {
    this.isStarted = true;
    this.tick();
  }

  @action.bound
  onGameOver(): void {
    alert('game over');
  }

  /**
   * 지뢰가 있는 곳인지 판단하는 메소드
   */
  @action.bound
  isBoom(row: number, column: number): boolean {
    return this.board[row][column] === BOOM;
  }

  /**
   * 벽인지 판단하는 메소드
   */
  @action.bound
  isWall(row: number, column: number): boolean {
    return this.board[row][column] === WALL;
  }

  /**
   * 지뢰도 없고 벽도 아닌 곳인지 판단하는 메소드
   */
  @action.bound
  isSafe(row: number, column: number): boolean {
    return !this.isBoom(row, column) && !this.isWall(row, column);
  }

  /**
   * 1. 방문한 적이 없고
   * 2. 벽이나 지뢰가 있는 지점이 아니고
   * 3. 기준점 주변에 지뢰가 없는 경우에만
   * 탐색 가능하다고 판단
   */
  @action.bound
  isSearchable(r: number, c: number): boolean {
    return (
      this.board[r - 1][c - 1] !== BOOM &&
      this.board[r - 1][c] !== BOOM &&
      this.board[r - 1][c + 1] !== BOOM &&
      this.board[r][c - 1] !== BOOM &&
      this.board[r][c + 1] !== BOOM &&
      this.board[r + 1][c - 1] !== BOOM &&
      this.board[r + 1][c] !== BOOM &&
      this.board[r + 1][c + 1] !== BOOM
    );
  }

  /**
   * 인접한 8 칸을 조사하면서 지뢰가 있음을 알려주는 숫자 (1~9)가 들어있는 셀을
   * 이어서 테두리가 둘러지는 영역을 구한다.
   * 이전에 방문했던 지점이거나 벽이라면 살피지 않음
   */
  @action.bound
  findSafeArea(row: number, column: number) {
    const queue: number[][] = [];
    queue.push([row, column]);

    while (queue.length > 0) {
      const [r, c] = queue.shift() as number[];

      this.displayMap[r][c] = 1;

      if (this.visited[r][c] || this.board[r][c] !== 0) {
        continue;
      }

      this.visited[r][c] = 1;

      if (this.isSearchable(r, c)) {
        queue.push([r - 1, c - 1]);
        queue.push([r - 1, c]);
        queue.push([r - 1, c + 1]);
        queue.push([r, c - 1]);
        queue.push([r, c + 1]);
        queue.push([r + 1, c - 1]);
        queue.push([r + 1, c]);
        queue.push([r + 1, c + 1]);
      }
    }
  }
}

export const BoomStoreContext = createContext<BoomStore>(null!);
