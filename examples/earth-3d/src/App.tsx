import * as React from 'react';
import Earth, {
  Layer,
  Light,
} from './Earth';
import './App.css';

import logo from './logo.svg';

class App extends React.Component {
  private handleHover() {

  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="three-container">
          <Earth radius={2}>
            <Light position={{ x: 4, y: 2, z: 8 }} autoUpdate />
            <Layer data={'world.json'} onHover={this.handleHover} />
          </Earth>
        </div>
      </div>
    );
  }
}

export default App;
