import { action, computed, observable, toJS } from 'mobx';
import { createContext } from 'react';

/**
 * 난이도 조절용
 */
export enum ELevel {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard'
}

export enum EDisplayType {
  WALL = -Infinity,
  UNKNOWN = -2,
  BOOM = -1,
  EMPTY = 0,
  FLAG = Infinity
}

export default class BoomStore {
  @observable rows: number = 0;
  @observable columns: number = 0;
  @observable booms: number = 0;
  @observable time: number = 0;
  @observable board: number[][] = []; /* 지뢰 기록 배열 */
  @observable
  visited: number[][] = []; /* 방문 여부 기록 배열, 탐색용으로만 사용됨 */
  @observable displayMap: number[][] = []; /* 보여주기 여부 결정 배열 */
  @observable isStarted: boolean = false;
  @observable isGameOver: boolean = false;

  timer: NodeJS.Timeout | number = 0;

  constructor(level: ELevel) {
    /**
     * 난이도에 따라 게임판의 크기와 지뢰 개수를 조절한다
     * 밸런스 조정은 필요해보임
     */
    if (level === ELevel.EASY) {
      this.rows = 8;
      this.columns = 8;
      this.booms = 10;
    } else if (level === ELevel.NORMAL) {
      this.rows = 12;
      this.columns = 12;
      this.booms = 30;
    } else {
      this.rows = 20;
      this.columns = 20;
      this.booms = 60;
    }

    this.initBoard();
  }

  @action.bound
  private initBoard(): void {
    this.board = [];
    this.visited = [];
    this.displayMap = [];

    /* row, column 보다 한 겹 더 둘러서 만든다, 탐색 시 오버플로우 에러 방지용 */
    for (let i = 0; i < this.rows + 2; i += 1) {
      this.board[i] = [];
      this.visited[i] = [];
      this.displayMap[i] = [];
      for (let j = 0; j < this.columns + 2; j += 1) {
        this.board[i].push(EDisplayType.WALL);
        this.visited[i].push(EDisplayType.WALL);
        this.displayMap[i].push(EDisplayType.WALL);
      }
    }

    /* 지뢰찾기 cells 생성 */
    for (let i = 1; i <= this.rows; i += 1) {
      for (let j = 1; j <= this.columns; j += 1) {
        this.board[i][j] = EDisplayType.EMPTY;
        this.visited[i][j] = EDisplayType.EMPTY;
        this.displayMap[i][j] = EDisplayType.UNKNOWN;
      }
    }

    /* 지뢰를 랜덤하기 심기 */
    let bombs = this.booms;
    while (bombs) {
      const randomRow = Math.floor(Math.random() * this.rows);
      const randomCol = Math.floor(Math.random() * this.columns);

      if (this.board[randomRow][randomCol] === EDisplayType.EMPTY) {
        this.board[randomRow][randomCol] = EDisplayType.BOOM;
        bombs -= 1;
      }
    }

    /* 인접한 칸에 지뢰가 몇 개 있는지 조사 */
    for (let i = 1; i <= this.rows; i += 1) {
      for (let j = 1; j <= this.columns; j += 1) {
        if (this.board[i][j] < EDisplayType.EMPTY) {
          continue;
        }

        /* 인접한 8칸을 조사 */
        if (this.board[i - 1][j - 1] === EDisplayType.BOOM) {
          this.board[i][j] += 1;
        }
        if (this.board[i][j - 1] === EDisplayType.BOOM) {
          this.board[i][j] += 1;
        }
        if (this.board[i + 1][j - 1] === EDisplayType.BOOM) {
          this.board[i][j] += 1;
        }
        if (this.board[i - 1][j] === EDisplayType.BOOM) {
          this.board[i][j] += 1;
        }
        if (this.board[i + 1][j] === EDisplayType.BOOM) {
          this.board[i][j] += 1;
        }
        if (this.board[i - 1][j + 1] === EDisplayType.BOOM) {
          this.board[i][j] += 1;
        }
        if (this.board[i][j + 1] === EDisplayType.BOOM) {
          this.board[i][j] += 1;
        }
        if (this.board[i + 1][j + 1] === EDisplayType.BOOM) {
          this.board[i][j] += 1;
        }
      }
    }
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

  get IsGameOver(): boolean {
    return this.isGameOver;
  }

  /**
   * 화면에 cell 의 내용을 보여줘도 되는지 판단하는 메소드
   * 1. 지뢰를 눌렀거나
   * 2. 빈 칸을 눌렀거나
   * 3. 숫자 칸을 눌렀으면 true 반환
   * 4. 그 외 false 반환
   */
  @action.bound
  shouldShowCell(row: number, column: number): boolean {
    return (
      this.displayMap[row][column] >= EDisplayType.EMPTY ||
      this.displayMap[row][column] === EDisplayType.BOOM
    );
  }

  @action.bound
  tick(): void {
    if (this.timer) {
      this.time += 1;
      this.timer = setTimeout(this.tick, 1000);
    }
  }

  @action.bound
  onGameStart(): void {
    this.isStarted = true;
    this.timer = setTimeout(this.tick);
  }

  /**
   * 지뢰를 모두 보이기 상태로 전환하고 게임을 종료한다.
   */
  @action.bound
  onGameOver(): void {
    this.isGameOver = true;
    for (let i = 1; i <= this.rows; i += 1) {
      for (let j = 1; j <= this.columns; j += 1) {
        if (this.board[i][j] === EDisplayType.BOOM) {
          this.displayMap[i][j] = EDisplayType.BOOM;
        }
      }
    }

    clearTimeout(this.timer as number);
    this.timer = 0;
  }

  /**
   * 게임을 재시작하기위해 관련된 모든 것들을 초기화한다
   */
  @action.bound
  onGameRestart(): void {
    clearTimeout(this.timer as number);
    this.timer = 0;
    this.time = 0;
    this.isGameOver = false;
    this.initBoard();
    this.onGameStart();
  }

  /**
   * 마우스 우클릭이 발생한 cell 에 깃발을 꼽거나 회수하는 메소드
   * 깃발을 꼽으면 지뢰 개수를 1개 줄이고,
   * 깃발을 회수하면 지뢰 개수를 1개 늘린다
   */
  @action.bound
  onPutFlag(row: number, column: number) {
    if (
      this.booms - 1 < 0 ||
      this.displayMap[row][column] === EDisplayType.EMPTY
    ) {
      return;
    }

    if (this.displayMap[row][column] === EDisplayType.FLAG) {
      this.displayMap[row][column] = EDisplayType.UNKNOWN;
      this.booms += 1;
    } else {
      this.displayMap[row][column] = EDisplayType.FLAG;
      this.booms -= 1;
    }
  }

  /**
   * 지뢰가 있는 곳인지 판단하는 메소드
   */
  @action.bound
  isBoom(row: number, column: number): boolean {
    return this.board[row][column] === EDisplayType.BOOM;
  }

  /**
   * 벽인지 판단하는 메소드
   */
  @action.bound
  isWall(row: number, column: number): boolean {
    return this.board[row][column] === EDisplayType.WALL;
  }

  /**
   * 지뢰도 없고 벽도 아닌 곳인지 판단하는 메소드
   */
  @action.bound
  isSafe(row: number, column: number): boolean {
    return !this.isBoom(row, column) && !this.isWall(row, column);
  }

  /**
   * 인접한 8칸 모두 지뢰가 없어야만 탐색 가능하다고 판단
   */
  @action.bound
  isSearchable(r: number, c: number): boolean {
    return (
      this.board[r - 1][c - 1] !== EDisplayType.BOOM &&
      this.board[r - 1][c] !== EDisplayType.BOOM &&
      this.board[r - 1][c + 1] !== EDisplayType.BOOM &&
      this.board[r][c - 1] !== EDisplayType.BOOM &&
      this.board[r][c + 1] !== EDisplayType.BOOM &&
      this.board[r + 1][c - 1] !== EDisplayType.BOOM &&
      this.board[r + 1][c] !== EDisplayType.BOOM &&
      this.board[r + 1][c + 1] !== EDisplayType.BOOM
    );
  }

  /**
   * 인접한 8 칸을 조사하면서 지뢰가 있음을 알려주는 숫자 (1~9)가 들어있는 셀을
   * 이어서 테두리가 둘러지는 영역을 구한다.
   * 이전에 방문했던 지점, 벽, 깃발, 지뢰가 있다면 살피지 않음
   */
  @action.bound
  findSafeArea(row: number, column: number) {
    const queue: number[][] = [];
    queue.push([row, column]);

    while (queue.length > 0) {
      const [r, c] = queue.shift() as number[];

      if (this.visited[r][c] || this.displayMap[r][c] === EDisplayType.FLAG) {
        continue;
      }

      this.displayMap[r][c] = this.board[r][c];
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
