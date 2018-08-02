import * as React from 'react';
import Earth, {
  Layer,
} from './Earth';
import './App.css';

import logo from './logo.svg';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="three-container">
          <Earth radius={2}>
            <Layer data={'world.json'} />
          </Earth>
        </div>
      </div>
    );
  }
}

export default App;
