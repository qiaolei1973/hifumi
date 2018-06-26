import { Matrix } from '@hifumi/ui';
import * as React from 'react';
import './App.css';

import logo from './logo.svg';

const viewMatrix = [
  1, 1, 1, 1,
  1, 1, 1, 1,
  1, 1, 1, 1,
  1, 1, 1, 1,
]

class App extends React.Component {
  public render() {
    const handleChange = (value:any) => {
      console.log(value);
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Matrix mat4={viewMatrix} onChange={handleChange} />
      </div>
    );
  }
}

export default App;
