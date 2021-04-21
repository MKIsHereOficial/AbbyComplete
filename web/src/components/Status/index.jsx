import './index.css';

import React, {useState, useCallback} from 'react';

import firebase from '../../firebase';

//import random from 'random';

/////////////////////////////////////////////////////

const firestore = firebase.firestore();

function AttrView({char = {id: '', attrs: []}, attr = {name: '', value: 0}}) {
    //console.log(attrs);

    const [value, setValue] = useState(attr.value);

    const charRef = firestore.collection('chars').doc(char.id);
    const attrId = char.attrs.indexOf(attr);
    
    attr.value = value;
    char.attrs[attrId] = attr;

    return <tr className={`attr attr_${attr.name}`}><td>{attr.name}</td><td><input type="number" value={parseInt(value)} onChange={async (e) => {setValue(e.target.valueAsNumber); charRef.set(char);}} /></td></tr>;
}

function StatusView({char = {name: '', inventory: [], attrs: []}}) {
    return (
        <div className="status-view">
            <table>
                <tbody>
                    <tr>
                        <th>Atributo</th>
                        <th>Valor</th>
                    </tr>
                    {char.attrs && char.attrs[0] ? char.attrs.map(data => <AttrView key={data.name} attr={data} char={char} />) : <tr><td>Este personagem não têm atributos.</td></tr>}
                </tbody>
            </table>
        </div>
    );
}

function Avatar({src = "", char = {name: ''}}) {
    var state = false;

    return <img alt={char.name} className={`char-avatar ${state !== false?state.toString():""}`} src={src} onMouseEnter={(e)=> {state = "hovered"; document.querySelector('.char-name').classList.add("hovered")}}  onMouseLeave={(e)=> {document.querySelector('.char-name').classList.remove("hovered"); state = false}}/>
}

export default function Status() {
    const userId = '765002665041068033';

    const chars = firestore.collection('chars');
    const charRef = chars.doc(userId);
    const [char, setChar] = useState({});
    charRef.get().then(ref => {
        setChar(ref.data());
    });

    return (
        <div className="Status">
            {char && char.name ? <h1 className={"char-name"}>{char.name}</h1> : ""}
            {char ? <StatusView char={char} /> : ""}
            {char && char.avatar ? <Avatar src={char.avatar} char={char} /> : <h3>Este personagem não possui uma imagem referente.</h3>}
        </div>
    )
}