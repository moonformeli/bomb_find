import React from 'react';

import styles from './BoomPlayBoard.scss';

interface IBoomPlayBoardProps {
  rows: number;
  columns: number;
}

const BoomPlayBoard: React.FC<IBoomPlayBoardProps> = ({ rows, columns }) => {
  const onCellClick = () => {};

  const cells = new Array(rows).fill(0).map((_, i) => {
    return (
      <div key={i} className={styles.cellContainer}>
        <div className={styles.poll} />
        <div className={styles.row}>
          {new Array(columns).fill(0).map((_, j) => {
            return (
              <div
                key={j}
                className={styles.cell}
                data-row={i}
                data-column={j}
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

export default BoomPlayBoard;
