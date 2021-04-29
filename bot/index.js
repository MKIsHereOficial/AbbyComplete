
const fs = require('fs'), path = require('path');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const Discord = require('discord.js'), client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});

client.commands = new Discord.Collection();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.dashboardURL = "https://abbythebot-b5876.web.app/";
client.db = require('./database.js');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const isTesting = true;
client.isTesting = isTesting;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function loadCommands() {
  try {
    var commandsFolder = await fs.readdirSync(path.join(__dirname, 'commands'));


    console.log(`|||||||||||||||||||||||||||||||||||||||||`);

    let size = 0;
    console.log(`Iniciando comandos... [${size}/${commandsFolder.length}]`);

    commandsFolder.map(fileName => {
      if (!fileName.endsWith('.js')) return;

      size++;

      let file = require(path.join(__dirname, "commands", fileName));

      fileName = fileName.replace('.js', '');

      if (file.help && file.help.name) fileName = file.help.name;

      let cmd = client.commands.set(fileName, file);

      if (file.help && file.help.aliases) {
        file.help.aliases.map(name => {
          client.commands.set(name, file);
        })
      }

      console.log(`${fileName} iniciado. [${size}/${commandsFolder.length}]`);
  });

  console.log(`Comandos iniciados. [${size}/${commandsFolder.length}]`);
  } catch (err) {
    console.error(err);
  }
}
loadCommands();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


async function loadEvents() {
  try {
    var eventsFolder = await fs.readdirSync(path.join(__dirname, 'events'));


    console.log(`|||||||||||||||||||||||||||||||||||||||||`);

    let size = 0;
    console.log(`Iniciando eventos... [${size}/${eventsFolder.length}]`);

    eventsFolder.map(fileName => {
      if (!fileName.endsWith('.js')) return;

      size++;

      let file = require(path.join(__dirname, "events", fileName));

      fileName = fileName.replace('.js', '');


      let ev = file;

      client.on(fileName, ev.run.bind(null, client));

      console.log(`${fileName} iniciado. [${size}/${eventsFolder.length}]`);
  });

  console.log(`Eventos iniciados. [${size}/${eventsFolder.length}]`);
  } catch (err) {
    console.error(err);
  }
}
loadEvents();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function start() {
  client.login((!isTesting) ? require('./bot.config.json').TOKEN : require('./bot.config.json').TEST_TOKEN);
}

start();
