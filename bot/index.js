
const fs = require('fs'), path = require('path');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const Discord = require('discord.js'), client = new Discord.Client();

client.commands = new Discord.Collection();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const firebase = require('firebase').default;

firebase.initializeApp(require('../web/src/firebase.config.json'));

const firestore = firebase.firestore();

client.db = firestore;

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

client.on('ready', () => {
  console.log(`Abby tá na área! [${client.user.tag}]`);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.on('message', async message => {
  if ( message.author.bot || !message.guild) return;
  const prefix = ".";


  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();
  command = client.commands.get(command);

  if (!command) return;

  command.run(client, message, args);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function start() {
  client.login(require('./bot.config.json').TOKEN);
}

start();