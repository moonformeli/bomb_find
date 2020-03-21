import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { classes, style } from 'typestyle';

import { BoomStoreContext } from '../../../stores/BoomStore';
import styles from './BoomPlayBoard.scss';

const showCellClassName = (value: number) => {
  switch (value) {
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
    default:
      return '';
  }
};

const BoomPlayBoard: React.FC = () => {
  const store = useContext(BoomStoreContext);

  const onCellClick = (e: React.MouseEvent) => {
    if (!store.IsStarted) {
      store.onGameStart();
    }

    const { row, column } = e.target['dataset'];
    if (store.isBoom(+row, +column)) {
      store.onGameOver();
      return;
    }
    store.findSafeArea(+row, +column);
  };

  const cells = new Array(store.Rows).fill(0).map((_, i) => {
    return (
      <div key={i} className={styles.cellContainer} onClick={onCellClick}>
        <div className={styles.poll} />
        <div className={styles.row}>
          {new Array(store.Columns).fill(0).map((_, j) => {
            const row = i + 1;
            const column = j + 1;

            return (
              <div
                key={j}
                className={classes(
                  styles.cell,
                  store.shouldShowCell(row, column) &&
                    showCellClassName(store.board[row][column])
                )}
                data-row={row}
                data-column={column}
              />
            );
          })}
        </div>
        <div className={styles.poll} />
      </div>
    );
  });

  return <div className={styles.container}>{cells}</div>;
};

export default observer(BoomPlayBoard);
