import './index.css';

import '@material/react-material-icon/dist/material-icon.css';
import MaterialIcon from '@material/react-material-icon';

import React, {useState, useEffect} from 'react';

import Database from '../../databasejs';

//import random from 'random';

/////////////////////////////////////////////////////

var savedAttrs = [];
var savedCharName = '';

var chars = {};


function AttrValueChanger({baseValue = 0, callback = function(value = 0) {return value;}}) {
    const [value, setValue] = useState(parseInt(baseValue));

    console.dir(value);

    const minus = () => {
        setValue(value - 1);
        callback(value);
    }

    const plus = () => {
        setValue(value + 1);
        callback(value);
    }


    return (
        <>
        <MaterialIcon icon="expand_more" onClick={minus} />
        <span>{value}</span>
        <MaterialIcon icon="expand_less" onClick={plus} />
        </>
    )
}

function AttrView({char = {attrs: []}, attr = {name: '', value: 0}}) {
    //console.log(attrs);

    const [value, setValue] = useState(parseInt(attr.value));

    const onChange = (value = '100' || 0) => {
        try {

            console.dir(value);
            setValue(parseInt(value));

            if (!value) setValue(0);


            if (savedAttrs.findIndex(e => e.name === attr.name) && savedAttrs[savedAttrs.findIndex(e => e.name === attr.name)]) {
                if (!value) setValue(0);
                setValue(parseInt(value));
                savedAttrs[savedAttrs.findIndex(e => e.name === attr.name)].value = value;
            } else {
                if (!value) setValue(0);
                setValue(parseInt(value));
                savedAttrs.push({name: attr.name, value});
            }
        } catch (err) {
            console.error(err);
        }
        
    }

    return <tr className={`attr attr_${attr.name}`}><td>{attr.name}</td><td><AttrValueChanger baseValue={value} callback={onChange}/></td></tr>;
}

function StatusView({char = {name: '', inventory: [], attrs: [], id: '', avatar: ''}}) {
    const save = ({attrs = char.attrs, name = char.name, inventory = char.inventory, id = char.id, avatar = char.avatar}) => {
        chars.set(char.id, {avatar, name, attrs, inventory, id});
        
        console.dir([name, id, avatar, attrs, inventory]);

        return {avatar, name, id, attrs, inventory};
    }

    if (char.attrs && char.attrs[0]) {
        char.attrs.map(data => {
            if (!savedAttrs.find(e => e.name === data.name)) {
                savedAttrs.push(data);
            }
        })
    }

    return (
        <div className="status-view">
            <table>
                <tbody>
                    <tr>
                        <th>Atributo</th>
                        <th>Valor</th>
                    </tr>
                    {char.attrs && char.attrs[0] ? char.attrs.map(data => <AttrView key={data.name} attr={data} />) : <tr><td>Este personagem não têm atributos.</td></tr>}
                </tbody>
            </table>
            <button className="save-button" onClick={(e) => {save({attrs: savedAttrs, name: savedCharName})}}>Salvar</button>
        </div>
    );
}

function Avatar({src = "", char = {name: ''}}) {
    var state = false;

    savedCharName = char.name;

    return <img alt={`Avatar de ${char.name}`} className={`char-avatar ${state !== false?state.toString():""}`} src={src} onMouseEnter={(e)=> {state = "hovered"; document.querySelector('.char-name').classList.add("hovered")}}  onMouseLeave={(e)=> {document.querySelector('.char-name').classList.remove("hovered"); state = false}}/>
}

export default function Status() {
    const userId = '765002665041068033';

    useEffect(() => {
        async function getDatabase(dbName) {
            const data = await Database(dbName);
            chars = data;
        }
        getDatabase('chars');
    }, [])

    const [char, setChar] = useState({id: userId});
    useEffect(() => {
        try {
            async function getChar(id) {
                try {
                    const data = await chars.get(id);
                    setChar(data);
                } catch (err) {
                    console.error(err);
                }
            }
            getChar(userId);
        } catch (err) {
            console.error(err);
        }
    }, [])
    console.dir(char);

    return (
        <div className="Status">
            {char && char.name ? <h1 className={"char-name"}>{char.name}</h1> : ""}
            {char ? <StatusView char={char} /> : ""}
            {char && char.avatar ? <Avatar src={char.avatar} char={char} /> : <h3>Este personagem não possui uma imagem referente.</h3>}
        </div>
    )
}