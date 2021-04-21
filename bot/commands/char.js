const {Message, MessageEmbed} = require('discord.js');

exports.run = async (client, message, args) => {
  var CHAR_GENERAL_ATTRS = [{name: 'Força', value: 0}, {name: 'Destreza', value: 0}, {name: 'Inteligência', value: 0}, {name: 'Tamanho', value: 0}, {name: 'Constituição', value: 0}, {name: 'Educação', value: 0}, {name: 'Movimento', value: 0}, {name: 'Aparência', value: 0}, ];
  const CHAR_GENERAL_ATTRS_NAMES = CHAR_GENERAL_ATTRS.map(data => {
    return data.name;
  })

  const chars = client.db.collection("chars");

  var CHAR_INVENTORY = [];

  const EMBED_COLOR = 'GREEN';
  let ATTRS_EMBED_DESCRIPTION = "";
  let INVENTORY_EMBED_DESCRIPTION = "";

  let charName = "Zé da Paçoca";

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
    await loadChar(user.id);
  } else {
    await loadChar();
  }

  loadAttrs();
  loadName();
  //message.channel.send(`${message.author}`, [charNameEmbed, charAttrs, charInventory]);
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


  async function loadChar(user = message.author.id) {
    try {
      let charData = {name: 'Zé da Paçoca', attrs: [{name: 'Força', value: 15}], inventory: [{name: 'Lanterna', quantity: 1}]};
      charData = (chars.doc(user)) ? chars.doc(user) : {};

      charData = await getData(charData);
      if (!charData) return new Error("Não existe charData.");

      //console.dir(charData);

      charName = charData.name;
      CHAR_GENERAL_ATTRS = charData.attrs;
      CHAR_INVENTORY = charData.inventory;

      loadInventory();
      loadAttrs();
      loadName();
    } catch (err) {
      console.error(err);
      user = message.author.id;
      let charData = {name: 'Zé da Paçoca', attrs: [{name: 'Força', value: 15}], inventory: [{name: 'Lanterna', quantity: 1}]};
      charData = (chars.doc(user)) ? chars.doc(user) : {};

      if (!charData) return null;

      charData = await getData(charData);

      charName = charData.name;
      CHAR_GENERAL_ATTRS = charData.attrs;
      CHAR_INVENTORY = charData.inventory;

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

  async function getData(ref) {
    let data = await ref.get();
    data = data.data();

    return data;
  }
}


exports.help = {
  name: 'character',
  aliases: ['char', 'perso', 'personagem']
}