import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';

import { BoomStoreContext } from '../../../stores/BoomStore';
import styles from './BoomPlayBoard.scss';

const BoomPlayBoard: React.FC = () => {
  const store = useContext(BoomStoreContext);

  const onCellClick = () => {
    if (!store.IsStarted) {
      store.onGameStart();
    }
  };

  const cells = new Array(store.Rows).fill(0).map((_, i) => {
    return (
      <div key={i} className={styles.cellContainer} onClick={onCellClick}>
        <div className={styles.poll} />
        <div className={styles.row}>
          {new Array(store.Columns).fill(0).map((_, j) => {
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

export default observer(BoomPlayBoard);
