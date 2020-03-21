import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { classes, style } from 'typestyle';

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
    case EDisplayType.NOT_BOOM:
      return styles.notBoom;
    case EDisplayType.DEAD_POINT:
      return styles.deadPoint;
    default:
      return '';
  }
};

interface ICellsProps {
  rows: number;
  columns: number;
  onCellClick: (e: React.MouseEvent) => void;
  shouldShowCell: (rows: number, columns: number) => boolean;
  displayMap: number[][];
}

const Cells: React.FC<ICellsProps> = observer(
  ({ rows, columns, onCellClick, shouldShowCell, displayMap }) => {
    return (
      <>
        {new Array(rows).fill(0).map((_, i) => {
          return (
            <div
              key={i}
              className={styles.cellContainer}
              onMouseDown={onCellClick}
              onContextMenu={e => e.preventDefault()}
            >
              <div className={styles.poll} />
              <div className={styles.row}>
                {new Array(columns).fill(0).map((_, j) => {
                  const row = i + 1;
                  const column = j + 1;

                  return (
                    <div
                      key={j}
                      className={classes(
                        styles.cell,
                        shouldShowCell(row, column) &&
                          showCellClassName(displayMap[row][column])
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
        })}
      </>
    );
  }
);

const BoomPlayBoard: React.FC = () => {
  const store = useContext(BoomStoreContext);
  const [map, setMap] = useState(store.displayMap);

  useEffect(() => {
    setMap(store.displayMap);
    store.isMapChanged = false;
  }, [store.isMapChanged]);

  const onLeftClick = (row: number, column: number): void => {
    if (store.isSafe(row, column)) {
      store.findSafeArea(row, column);
    } else {
      store.DeadRow = row;
      store.DeadColumn = column;
      store.onGameOver(false);
    }
  };

  const onRightClick = (row: number, column: number): void => {
    store.onPutFlag(row, column);
  };

  const onCellClick = (e: React.MouseEvent) => {
    if (store.IsGameOver) {
      return;
    }
    if (!store.IsStarted) {
      store.onGameStart();
    }

    const { button } = e;
    const { row, column } = e.target['dataset'];

    if (button === EMouseButton.RIGHT_CLICK) {
      onRightClick(+row, +column);
    } else if (button === EMouseButton.LEFT_CLICK) {
      onLeftClick(+row, +column);
    }

    /**
     * 클릭의 종류에 상관없이 클릭이 발생하면
     * 게임 종료의 여부를 판단한다
     */
    if (store.hasFoundAll()) {
      store.successGame();
    }
  };

  return (
    <div className={styles.container}>
      <Cells
        rows={store.Rows}
        columns={store.Columns}
        onCellClick={onCellClick}
        shouldShowCell={store.shouldShowCell}
        displayMap={map}
      />
    </div>
  );
};

export default observer(BoomPlayBoard);
