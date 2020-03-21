import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { classes } from 'typestyle';

import { BoomStoreContext, EDisplayType } from '../../../stores/BoomStore';
import styles from './BoomPlayBoard.scss';

enum EMouseButton {
  LEFT_CLICK = 0,
  RIGHT_CLICK = 2
}

const showCellClassName = (value: number) => {
  switch (value) {
    case EDisplayType.EMPTY:
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
    case EDisplayType.BOOM:
      return styles.boom;
    case EDisplayType.FLAG:
      return styles.flag;
    default:
      return '';
  }
};

const BoomPlayBoard: React.FC = () => {
  const store = useContext(BoomStoreContext);

  const onCellClick = (e: React.MouseEvent) => {
    const { button } = e;
    const { row, column } = e.target['dataset'];

    if (button === EMouseButton.RIGHT_CLICK) {
      store.onPutFlag(row, column);
      return;
    }

    if (store.IsGameOver) {
      return;
    }

    if (!store.IsStarted) {
      store.onGameStart();
    }

    if (store.isBoom(+row, +column)) {
      store.onGameOver();
      return;
    }
    store.findSafeArea(+row, +column);
  };

  const cells = new Array(store.Rows).fill(0).map((_, i) => {
    return (
      <div
        key={i}
        className={styles.cellContainer}
        onMouseDown={onCellClick}
        onContextMenu={e => e.preventDefault()}
      >
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
                    showCellClassName(store.displayMap[row][column])
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
