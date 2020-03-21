import React from 'react';
import ReactDOM from 'react-dom';

import BoomContainer from '../components/Boom/BoomContainer/BoomContainer';
import styles from './index.scss';

const App: React.FC = () => {
  return (
    <section>
      <BoomContainer rows={8} columns={8} />
    </section>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
