import React from 'react';
import ReactDOM from 'react-dom';
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import BoomContainer from '../components/Boom/BoomContainer/BoomContainer';
import { ELevel } from '../components/Common/EN_LEVEL';
import LevelSelect from '../components/LevelSelect/LevelSelect';

const App: React.FC = () => {
  return (
    <Router>
      <section>
        <Switch>
          <Route exact path="/">
            <LevelSelect />
          </Route>
          <Route path="/game">
            <BoomContainer />
          </Route>
        </Switch>
      </section>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
