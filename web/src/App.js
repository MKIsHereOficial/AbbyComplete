import './App.css';

import React, {useState, useCallback} from 'react';

import Roller from './components/Roller';
import Status from './components/Status';

import firebase from './firebase';

const analytics = firebase.analytics();


function App() {
  return (
    <div className="App">
      <Status />
    </div>
  );
}

export default App;
