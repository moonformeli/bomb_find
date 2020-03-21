import { observer } from 'mobx-react-lite';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { style } from 'typestyle';

import BoomStore, { BoomStoreContext } from '../../../stores/BoomStore';
import { ELevel } from '../../Common/EN_LEVEL';
import BoomBorder from '../BoomBorder/BoomBorder';
import BoomPlayBoard from '../BoomPlayBoard/BoomPlayBoard';
import BoomRecord from '../BoomRecord/BoomRecord';
import BoomScoreBoard from '../BoomScoreBoard/BoomScoreBoard';
import styles from './BoomContainer.scss';

const BoomContainer: React.FC = () => {
  const [store, setStore] = useState<BoomStore>(null!);

  useEffect(() => {
    const parsedSearch = qs.parse(location.search, { ignoreQueryPrefix: true });
    const user = parsedSearch?.user || 'unknown';
    const level = parsedSearch?.level || ELevel.EASY;

    setStore(new BoomStore(level, user));
  }, []);

  if (!store) {
    return null;
  }

  const borderLength = store.Columns + 2;
  const containerWidth = style({
    width: `calc(${store.Columns * 1.6 + 2}rem)`
  });

  return (
    <BoomStoreContext.Provider value={store}>
      <Link to="/" className={styles.anchor}>
        {'< Back'}
      </Link>
      {store.IsGameOver && !store.IsFail && (
        <h3>YOUR CLEAR TIME IS {store.Time}s</h3>
      )}
      <section className={containerWidth}>
        <article>
          <BoomBorder length={borderLength} position={'top'} />
          <div className={style({ display: 'flex' })}>
            <div className={styles.leftpoll} />
            <BoomScoreBoard />
            <div className={styles.rightpoll} />
          </div>
          <BoomBorder length={borderLength} position={'mid'} />
        </article>
        <article>
          <BoomPlayBoard />
          <BoomBorder length={borderLength} position={'bottom'} />
        </article>
      </section>
      <BoomRecord />
    </BoomStoreContext.Provider>
  );
};

export default observer(BoomContainer);
