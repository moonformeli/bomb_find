import { observer } from 'mobx-react-lite';
import React, { useRef } from 'react';
import { style } from 'typestyle';

import BoomStore, { BoomStoreContext, ELevel } from '../../../stores/BoomStore';
import BoomBorder from '../BoomBorder/BoomBorder';
import BoomPlayBoard from '../BoomPlayBoard/BoomPlayBoard';
import BoomScoreBoard from '../BoomScoreBoard/BoomScoreBoard';
import styles from './BoomContainer.scss';

interface IBoomContainerProps {
  level: ELevel;
}

const BoomContainer: React.FC<IBoomContainerProps> = ({ level }) => {
  const store = useRef(new BoomStore(level)).current;

  const borderLength = store.Columns + 2;
  const containerWidth = style({
    width: `calc(${store.Columns * 1.6 + 2}rem)`
  });

  return (
    <BoomStoreContext.Provider value={store}>
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
    </BoomStoreContext.Provider>
  );
};

export default observer(BoomContainer);
