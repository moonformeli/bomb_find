import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { classes } from 'typestyle';

import { BoomStoreContext } from '../../../stores/BoomStore';
import styles from './BoomScoreBoard.scss';

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

const BoomScoreBoard: React.FC = () => {
  const store = useContext(BoomStoreContext);

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

  const onGameStart = () => {
    store.onGameRestart();
  };

  return (
    <div className={styles.container}>
      {countBoard(store.Booms, 'left')}
      <div onClick={onGameStart}>
        <i className={store.IsGameOver ? styles.gameOver : styles.gameStart} />
      </div>
      {countBoard(store.Time, 'right')}
    </div>
  );
};

export default observer(BoomScoreBoard);
