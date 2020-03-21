import React from 'react';
import ReactDOM from 'react-dom';

import BoomContainer from '../components/Boom/BoomContainer/BoomContainer';
import { ELevel } from '../stores/BoomStore';

const App: React.FC = () => {
  return (
    <section>
      <BoomContainer level={ELevel.HARD} />
    </section>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
