import React from 'react';
import { classes } from 'typestyle';

import styles from './BoomScoreBoard.scss';

interface IBoomScoreBoardProps {
  booms: number;
  time: number;
  columns: number;
}

const getNumSignClass = (sign: number): string => {
  switch (sign) {
    case 0:
      return styles.zero;
    case 1:
      return styles.one;
    case 2:
      return styles.two;
    case 3:
      return styles.three;
    case 4:
      return styles.four;
    case 5:
      return styles.five;
    case 6:
      return styles.six;
    case 7:
      return styles.seven;
    case 8:
      return styles.eight;
    case 9:
      return styles.nine;
    default:
      return '';
  }
};

const BoomScoreBoard: React.FC<IBoomScoreBoardProps> = ({
  booms,
  time,
  columns
}) => {
  const countBoard = (
    countable: number,
    position: 'left' | 'right'
  ): JSX.Element => {
    return (
      <div
        className={classes(
          styles.count,
          position === 'left' ? styles.left : styles.right
        )}
      >
        <i className={getNumSignClass(Math.trunc(countable / 100))} />
        <i className={getNumSignClass(Math.trunc(countable / 10) % 10)} />
        <i className={getNumSignClass(countable % 10)} />
      </div>
    );
  };

  const onGameStart = () => {};

  return (
    <div className={styles.container}>
      {countBoard(booms, 'left')}
      <div onClick={onGameStart}>
        <i className={styles.gameStart} />
      </div>
      {countBoard(time, 'right')}
    </div>
  );
};

export default BoomScoreBoard;
