import React from 'react';
import ReactDOM from 'react-dom';

import styles from './index.scss';

const App: React.FC = () => {
  return <h1 className={styles.title}>hi</h1>;
};

ReactDOM.render(<App />, document.getElementById('root'));
