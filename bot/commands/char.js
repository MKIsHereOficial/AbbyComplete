const {Message, MessageEmbed, User} = require('discord.js');

const Database = require('../../database.js');

exports.run = async (client, message, args) => {
  var CHAR_GENERAL_ATTRS = [{name: 'Força', value: 0}, {name: 'Destreza', value: 0}, {name: 'Inteligência', value: 0}, {name: 'Tamanho', value: 0}, {name: 'Constituição', value: 0}, {name: 'Educação', value: 0}, {name: 'Movimento', value: 0}, {name: 'Aparência', value: 0}, ];
  const CHAR_GENERAL_ATTRS_NAMES = CHAR_GENERAL_ATTRS.map(data => {
    return data.name;
  })

  const chars = await Database("chars");

  var CHAR_INVENTORY = [];

  const EMBED_COLOR = 'GREEN';
  let ATTRS_EMBED_DESCRIPTION = "";
  let INVENTORY_EMBED_DESCRIPTION = "";

  let charName = "Zé da Paçoca";
  let withoutCharacter = false;
  let withoutCharacterMessage = `Você não têm personagem.`;

  const charNameEmbed = new MessageEmbed()
  .setTitle(charName)
  .setColor(EMBED_COLOR);
  const charAttrs = new MessageEmbed()
  .setTitle("Atributos")
  .setDescription(ATTRS_EMBED_DESCRIPTION)
  .setColor(EMBED_COLOR);
  const charInventory = new MessageEmbed()
  .setTitle("Inventário")
  .setDescription(INVENTORY_EMBED_DESCRIPTION)
  .setColor(EMBED_COLOR);

  await loadChar();

  var user = message.author;

  if (message.mentions.users.first()) {
    user = message.mentions.users.first();
    await loadChar(user);
  } else {
    await loadChar();
  }

  loadAttrs();
  loadName();
  //message.channel.send(`${message.author}`, [charNameEmbed, charAttrs, charInventory]);
  if (!withoutCharacter) {
    message.channel.send({content: `${message.author}`, embed: charNameEmbed}).then(msg => {
      const msgs = [msg];
      msg.channel.send(charAttrs).then(msg => {
        msgs.push(msg);
        msg.channel.send(charInventory).then(msg => {
          msgs.push(msg);
          function react(msg = new Message()) {
            return msg.react(`📝`);
          }

          return react(msg).then(reaction => {
            if (reaction.users.cache.get(user.id)) {
              msg.channel.send(`${message.author}\nhttps://abbythebot.web.com`)
              msgs.map(msg => msg.delete());
            }
          });
        });
      });
    });
  } else {
    message.channel.send(`${message.author}\n${withoutCharacterMessage}`);
  }


  async function loadChar(user = message.author) {
    if (user != message.author) withoutCharacterMessage = `\`${user.tag}\` não têm personagem.`;
    user = user.id;
    try {
      let charData = {value: {name: 'Zé da Paçoca', attrs: [{name: 'Força', value: 15}], inventory: [{name: 'Lanterna', quantity: 1}]}};
      charData = (await chars.exists(user)) ? await chars.get(user, charData) : await chars.set(user, charData);

      charData = charData.value;

      console.dir(charData);

      charName = charData.name || "Sem Personagem";
      withoutCharacter = true;
      //CHAR_GENERAL_ATTRS = charData.attrs || CHAR_GENERAL_ATTRS;
      //CHAR_INVENTORY = charData.inventory || [];

      loadInventory();
      loadAttrs();
      loadName();
    } catch (err) {
      console.error(err);
      user = message.author.id;
      let charData = {value: {name: 'Zé da Paçoca', attrs: [{name: 'Força', value: 15}], inventory: [{name: 'Lanterna', quantity: 1}]}};
      charData = (await chars.exists(user)) ? await chars.get(user, charData) : await chars.set(user, charData);

      charData = charData.value;

      console.dir(charData);
      
      charName = charData.name;

      //CHAR_GENERAL_ATTRS = charData.attrs || [];
      //CHAR_INVENTORY = charData.inventory || [];

      loadInventory();
      loadAttrs();
      loadName();
    }
  }
  
  function loadAttrs() {
    console.log(`[${charName}]`, `Carregando atributos...`);
    ATTRS_EMBED_DESCRIPTION = "";
    CHAR_GENERAL_ATTRS.map(data => {
      ATTRS_EMBED_DESCRIPTION += `${data.name}: ${data.value.toLocaleString()}\n`;
      charAttrs.setDescription(ATTRS_EMBED_DESCRIPTION);
    });
    console.log(`[${charName}]`, `Atributos carregados.`);
  }
  
  function loadInventory() {
    console.log(`[${charName}]`, `Carregando inventário.`);
    INVENTORY_EMBED_DESCRIPTION = "";
    CHAR_INVENTORY.map(data => {
      INVENTORY_EMBED_DESCRIPTION += `${data.quantity.toLocaleString()}x ${data.name}\n`;
      charInventory.setDescription(INVENTORY_EMBED_DESCRIPTION);
    });
    console.log(`[${charName}]`, `Inventário carregado.`);
  }

  function loadName() {
    charNameEmbed.setTitle(charName);
  }
}


exports.help = {
  name: 'character',
  aliases: ['char', 'perso', 'personagem']
}