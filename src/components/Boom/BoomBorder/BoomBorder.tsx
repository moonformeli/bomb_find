import React from 'react';
import { classes } from 'typestyle';

import styles from './BoomBorder.scss';

interface IBoomBorderProps {
  length: number;
  position: 'top' | 'mid' | 'bottom';
}

const BoomBorder: React.FC<IBoomBorderProps> = ({ length, position }) => {
  const leftEdgeClassName =
    position === 'top'
      ? styles.leftTopEdge
      : position === 'mid'
      ? styles.leftMidEdge
      : styles.leftBottomEdge;
  const rightEdgeClassName =
    position === 'top'
      ? styles.rightTopEdge
      : position === 'mid'
      ? styles.rightMidEdge
      : styles.rightBottomEdge;

  return (
    <div
      className={classes(
        styles.container,
        position === 'bottom' && styles.bottomContainer
      )}
    >
      {new Array(length).fill(0).map((_, i) => {
        let className = '';
        if (i === 0) {
          className = leftEdgeClassName;
        } else if (i === length - 1) {
          className = rightEdgeClassName;
        } else {
          className = styles.scoreBoardBorder;
        }

        return <div className={className} key={i} />;
      })}
    </div>
  );
};

export default BoomBorder;
