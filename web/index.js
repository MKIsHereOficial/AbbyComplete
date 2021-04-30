const express = require('express'), app = express();

const faker = require('faker')
const bodyParser = require('body-parser')
/////////////////////////////////////////////////////////////////////////
const path = require('path');

const Database = require('./database');

/////////////////////////////////////////////////////////////////////////

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')     // Setamos que nossa engine será o ejs
app.use(bodyParser.urlencoded({extended: true}))  // Com essa configuração, vamos conseguir parsear o corpo das requisições


/////////////////////////////////////////////////////////////////////////

app.get('/:uid/dashboard', async (req, res) => {
    const userId = req.params['uid'];

    const chars = await Database('chars');
    var char = await chars.get(userId);
    char = char.value;

    var attrsTotal = 0;

    char.attrs.map(data => {
        attrsTotal += parseFloat(data.value);
    })

    char.attrsTotal = attrsTotal;

    console.dir(char);

    res.render('dashboard', char);
});

app.post('/:uid/dashboard', async (req, res) => {
    const userId = req.params['uid'];

    const chars = await Database('chars');
    var char = await chars.get(userId);
    char = char.value;


    const body = req && req.body;
    console.dir(body);

    var attrs = [];
    char.attrs.map(data => {
        var dataName = `status_${data.name}`;

        var dataValue = parseFloat(body[dataName]);

        attrs.push({name: data.name, value: dataValue});
    });

    char.attrs = attrs;
    var attrsTotal = 0;

    char.attrs.map(data => {
        attrsTotal += parseFloat(data.value);
    })

    char.attrsTotal = attrsTotal;
    chars.set(char.id, char);

    res.render('dashboard', char);
});

/////////////////////////////////////////////////////////////////////////

app.listen(3000, () => {
    console.log(`App iniciado na porta 3000.`);
});