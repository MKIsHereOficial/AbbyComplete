import './index.css';

import React, {useState, useCallback} from 'react';

import {TextField} from '@material-ui/core';

import random from 'random';

let outputs = 0;

while (outputs > 4) outputs = 0;

function Outputs({value}) {
  return <h3>{value}</h3>;
}

function Roller() {
  const [rollTimes, setRollTimes] = useState(4);
  const [rollValue, setRollValue] = useState(20);

  var [output, setOutput] = useState([]);
  const [finalOutput, setFinalOutput] = useState(0);

  return (
    <div className="roller">
      <div className="roller-head">
        <form>
          <input value={rollTimes} className="rollTimes" onChange={(e) => {setRollTimes(parseFloat(e.target.value)); output = 0}} />
          <input value={rollValue} onChange={(e) => {setRollValue(parseFloat(e.target.value)); output = 0}} />
        </form>
      </div>
      <div className="roller-center">
        <div className="outputs">
        {(output.length > 1) ? output && output.map && output.map(val => Outputs({value: val})) + (finalOutput > 0) ? " = " : "" + (finalOutput > 0) ? <Outputs value={finalOutput} /> : "" : <Outputs value={finalOutput} /> }
        </div>
      </div>
      <RollButton rollValue={rollValue} rollTimes={rollTimes} sets={{output, setOutput, setFinalOutput}} />
    </div>
  )
}


function RollButton({rollValue = 20, rollTimes = 4, sets = {output: [], setFinalOutput: true}}) {
  const click = (e) => {
    console.log(rollValue, rollTimes);

    const {output, setOutput, setFinalOutput} = sets;

    setOutput([])
    let array = [];

    let lastVal = 0;
    for (let i = 0; i < rollTimes; i++) {
      let val = random.int(1, rollValue);
      setFinalOutput(lastVal + val)
      lastVal += val;

      array.push((() => {
        if (rollTimes > 1) {
          if (rollTimes >= 2 && i !== (rollTimes - 1)) {
            return val + " + ";
          }
        } 

        return val;
      })());
    }
    setOutput(array);

    console.log(output, array);

    outputs = 0;
  }

  return <button onClick={click}>Rolar</button>;
}

export default Roller;