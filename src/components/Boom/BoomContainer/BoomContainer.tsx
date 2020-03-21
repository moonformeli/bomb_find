import React from 'react';
import { style } from 'typestyle';

import BoomBorder from '../BoomBorder/BoomBorder';
import BoomPlayBoard from '../BoomPlayBoard/BoomPlayBoard';
import BoomScoreBoard from '../BoomScoreBoard/BoomScoreBoard';
import styles from './BoomContainer.scss';

interface IBoomContainerProps {
  rows: number;
  columns: number;
}

const BoomContainer: React.FC<IBoomContainerProps> = ({ rows, columns }) => {
  const borderLength = columns + 2;
  const containerWidth = style({
    width: `calc(${columns * 1.6 + 2}rem)`
  });

  return (
    <section className={containerWidth}>
      <article>
        <BoomBorder length={borderLength} position={'top'} />
        <div className={style({ display: 'flex' })}>
          <div className={styles.leftpoll} />
          <BoomScoreBoard booms={99} time={0} columns={columns} />
          <div className={styles.rightpoll} />
        </div>
        <BoomBorder length={borderLength} position={'mid'} />
      </article>
      <article>
        <BoomPlayBoard rows={rows} columns={columns} />
        <BoomBorder length={borderLength} position={'bottom'} />
      </article>
    </section>
  );
};

export default BoomContainer;
