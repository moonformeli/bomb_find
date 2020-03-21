import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';

import { BoomStoreContext } from '../../../stores/BoomStore';
import styles from './BoomRecord.scss';

const BoomRecord: React.FC = () => {
  const store = useContext(BoomStoreContext);
  const [records, setRecords] = useState<(number | string)[][]>([]);

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('records') as string);
      setRecords(
        history.sort((recordA, recordB) => {
          return recordA[1] - recordB[1];
        })
      );
    } catch {
      setRecords([[store.User, store.Time]]);
    }
  }, [store.IsGameOver]);

  return (
    <footer>
      <ul>
        {records.map((record, i) => {
          return (
            <li key={i} className={styles.record}>
              <span>
                {i + 1}. {record[0]}
              </span>
              <span>{record[1]}</span>
            </li>
          );
        })}
      </ul>
    </footer>
  );
};

export default observer(BoomRecord);
