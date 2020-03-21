import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { ELevel, ELevelColumns, ELevelRows } from '../Common/EN_LEVEL';
import styles from './LevelSelect.scss';

const LevelSelect: React.FC = () => {
  const [userName, setUserName] = useState('');

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>SELECT THE LEVEL</h2>
      <input
        type="text"
        placeholder="TYPE YOUR NAME"
        onChange={e => setUserName(e.target.value)}
        value={userName}
      />
      <Link
        to={`/game?level=${ELevel.EASY}&user=${userName}`}
        className={styles.anchor}
      >
        <div className={styles.level}>
          <p>
            <strong>{ELevel.EASY}</strong> ({ELevelRows.EASY} x{' '}
            {ELevelColumns.EASY})
          </p>
        </div>
      </Link>
      <Link
        to={`/game?level=${ELevel.NORMAL}&user=${userName}`}
        className={styles.anchor}
      >
        <div className={styles.level}>
          <p>
            <strong>{ELevel.NORMAL}</strong> ({ELevelRows.NORMAL} x{' '}
            {ELevelColumns.NORMAL})
          </p>
        </div>
      </Link>
      <Link
        to={`/game?level=${ELevel.HARD}&user=${userName}`}
        className={styles.anchor}
      >
        <div className={styles.level}>
          <p>
            <strong>{ELevel.HARD}</strong> ({ELevelRows.HARD} x{' '}
            {ELevelColumns.HARD})
          </p>
        </div>
      </Link>
    </div>
  );
};

export default LevelSelect;
