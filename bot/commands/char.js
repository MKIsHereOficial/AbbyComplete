const {Message, MessageEmbed, MessageReaction} = require('discord.js');

const Database = require('../database.js');

exports.run = async (client, message, args) => {
  var CHAR_GENERAL_ATTRS = [{name: 'Força', value: 0}, {name: 'Destreza', value: 0}, {name: 'Inteligência', value: 0}, {name: 'Tamanho', value: 0}, {name: 'Constituição', value: 0}, {name: 'Educação', value: 0}, {name: 'Movimento', value: 0}, {name: 'Aparência', value: 0}, ];
  const CHAR_GENERAL_ATTRS_NAMES = CHAR_GENERAL_ATTRS.map(data => {
    return data.name;
  })

  const admins = await Database("admins");
  const chars = await Database("chars");

  var CHAR_INVENTORY = [];

  const EMBED_COLOR = 'GREEN';
  let ATTRS_EMBED_DESCRIPTION = "";
  let INVENTORY_EMBED_DESCRIPTION = "";

  let charName = "Zé da Paçoca";
  let creatingCharacter = false;
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

  var user = message.author;


  async function deleteChar() {
    if (!message.mentions.users.first()) {
      var charsExists = await chars.exists(user.id);
      charsExists = charsExists.exists;

      if (!charsExists) return message.channel.send(`${message.author}\nVocê não têm personagem.`);
      chars.delete(user.id);
      return message.channel.send(`${message.author}\nPersonagem deletado.`);
    } else if (message.mentions.users.first()) {
      user = message.mentions.users.first(); 
        
      var charsExists = await chars.exists(user.id);
      charsExists = charsExists.exists;

      if (!charsExists) return message.channel.send(`${message.author}\n\`${user.tag}\` não têm personagem.`);

      console.dir(await admins.exists(message.author.id));
      if ("err" in await admins.exists(message.author.id)) {
        return message.channel.send(`${message.author}\nVocê não têm permissão para executar essa ação.`);
      }

      await chars.delete(user.id);

      return message.channel.send(`${message.author}\nPersonagem de \`${user.tag}\` deletado.`)
    
    } 
  }

  async function createChar() {
    if (args[0] === "create" && !message.mentions.users.first()) {
      args.shift();
      creatingCharacter = true;
      chars.set(user.id, {name: (args[0]) ? args.join(" ") : "Sem Nome", attrs: CHAR_GENERAL_ATTRS, inventory: [], id: user.id});
      loadChar(user);
      withoutCharacter = false;
    } else if (args[1] === "create" && message.mentions.users.first()) {
      user = message.mentions.users.first();

      if ("err" in admins.get(message.author.id)) {
        return message.channel.send(`${message.author}\nVocê não têm permissão para executar essa ação.`);
      }

      console.log(args);
      args.shift(); args.shift();
      creatingCharacter = true;
      chars.set(user.id, {name: (args[0]) ? args.join(" ") : "Sem Nome", attrs: CHAR_GENERAL_ATTRS, inventory: [], id: user.id});
      loadChar(user);
      withoutCharacter = false;
    }
  }

  if (message.mentions.users.first()) {
    user = message.mentions.users.first();
    if (!(await chars.get(user.id)).value) withoutCharacter = true;
    await loadChar(user);

    loadAttrs();
    await loadInventory();
    loadName();
  } else {
    if (!(await chars.get(user.id)).value) withoutCharacter = true;

    await loadChar();

    loadAttrs();
    await loadInventory();
    loadName();
  }

  function sendCharData() {
    message.channel.send({content: `${message.author}`, embed: charNameEmbed}).then(msg => {
      const msgs = [msg];
      msg.channel.send(charAttrs).then(msg => {
        msgs.push(msg);
        msg.channel.send(charInventory).then(msg => {
          msgs.push(msg);
          function react(msg = new Message()) {
            return msg.react(`📝`);
          }
          var reacted = false;
          
          return react(msg).then(r => {;
            const ev = client.on('messageReactionAdd', async (reaction, u) => {
              if (reacted) return;
              if (reaction.message.partial) await reaction.message.fetch();
              if (reaction.partial) await reaction.fetch();
            
              if (u.id != message.author.id || reaction.message.id != r.message.id) return;
              if (u.bot) return;
              if (!reaction.message.guild) return;

              if (reaction.emoji.name != r.emoji.name) return;
            
              //console.dir(reaction);
              //console.dir(u);
              //console.dir(ev);

              msgs.map(async msg => {
                if (msgs.indexOf(msg) >= msgs.length - 1) {
                  message.delete();
                  if (user.id != message.author.id) {
                    if ("err" in await admins.get(message.author.id)) msg.channel.send(`${message.author}\nVocê não têm permissão para editar um Personagem que não seja seu.`)
                    msg.channel.send(`${message.author}\nPara editar esse personagem, use o site. [${client.dashboardURL}]`);
                  } else {
                    msg.channel.send(`${message.author}\nPara editar seu personagem, use o site. [${client.dashboardURL}]`);
                  }
                }
                msg.delete()
              });
              reacted = true;
            });
          });

        });
      });
    });
  }

  //message.channel.send(`${message.author}`, [charNameEmbed, charAttrs, charInventory]);
  if (!withoutCharacter) {
    sendCharData();
  } else if (!creatingCharacter) {
    message.channel.send(`${message.author}\n${withoutCharacterMessage}`).then(msg => {
      var reacted = false;
      const msgs1 = [];
      msgs1.push(msg);
      msg.react("➕").then(r => {
        const ev = client.on('messageReactionAdd', async (reaction, u) => {
          if (reacted) return;
          if (reaction.message.partial) await reaction.message.fetch();
          if (reaction.partial) await reaction.fetch();
        
          if (u.id != message.author.id || reaction.message.id != r.message.id) return;
          if (u.bot) return;
          if (!reaction.message.guild) return;

          if (reaction.emoji.name != r.emoji.name) return;
        
          //console.dir(reaction);
          //console.dir(u);
          //console.dir(ev);

          channel = reaction.message.channel;
          channel.startTyping();
          msgs1.push(channel.send(`${message.author}\nQual nome você deseja para o Personagem?`));
          channel.stopTyping()

          

          // Await !vote messages
          const filter = m => m.author.id === u.id;
          // Errors: ['time'] treats ending because of the time limit as an error
          channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(async collected => {
              var name = collected.first().content;
              collected.first().delete();
              const char = await chars.set(user.id, {id: user.id, name: name, attrs: CHAR_GENERAL_ATTRS, inventory: []}).then(async data => {
                msgs1.map(msg => (msg && msg.delete) ? msg.delete() : null);

                await loadChar(user);
                await loadAttrs();
                await loadInventory();
                loadName();

                setTimeout(() => {
                  return sendCharData();
                }, 60);
              })
            })
            .catch(collected => {
              msgs1.map(msg => msg.delete());
              return channel.send(`O tempo acabou, tente novamente mais tarde.`).then(msg => setTimeout(msg.delete(), 1500));
            });



          reacted = true;
        });
      });
    });
  }


  async function loadChar(user = message.author) {
    if (user != message.author) withoutCharacterMessage = `\`${user.tag}\` não têm personagem.`;
    try {
      let charData = {name: 'Sem Nome', attrs: CHAR_GENERAL_ATTRS, inventory: []};
      charData = (await chars.exists(user.id)) ? await chars.get(user.id, charData) : null;

      charData = ("value" in charData) ? charData.value : charData;

      console.dir(charData);

      charName = charData.name;
      if (!charName) withoutCharacter = true;
      CHAR_GENERAL_ATTRS = charData.attrs || CHAR_GENERAL_ATTRS;
      CHAR_INVENTORY = charData.inventory || [];

      if (!charData || !"id" in charData) {
        return `${(user.id != message.author.id) ? `\`${user.tag}\` não têm personagem.` : "Você não têm personagem."}`
      }

      loadInventory();
      loadAttrs();
      loadName();
    } catch (err) {
      console.error(err);
      user = message.author.id;
      let charData = {name: 'Sem Nome', attrs: CHAR_GENERAL_ATTRS, inventory: []};
      charData = (await chars.exists(user.id)) ? await chars.get(user.id, charData) : null;

      charData = ("value" in charData) ? charData.value : charData;

      console.dir(charData);
      
      charName = charData.name;
      if (!charName) withoutCharacter = true;
      CHAR_GENERAL_ATTRS = charData.attrs || [];
      CHAR_INVENTORY = charData.inventory || [];

      if (!charData || !"id" in charData) {
        return `${(user.id != message.author.id) ? `\`${user.tag}\` não têm personagem.` : "Você não têm personagem."}`
      }

      loadInventory();
      loadAttrs();
      loadName();
    }
  }
  
  function loadAttrs() {
    console.log(`[${charName}]`, `Carregando atributos...`);
    ATTRS_EMBED_DESCRIPTION = "";
    CHAR_GENERAL_ATTRS.map(data => {
      ATTRS_EMBED_DESCRIPTION += `${data.name}: ${data.value.toLocaleString('pt-BR')}\n`;
      charAttrs.setDescription(ATTRS_EMBED_DESCRIPTION);
    });
    console.log(`[${charName}]`, `Atributos carregados.`);
  }
  
  function loadInventory() {
    console.log(`[${charName}]`, `Carregando inventário.`);
    INVENTORY_EMBED_DESCRIPTION = "";
    CHAR_INVENTORY.map(async data => {
      INVENTORY_EMBED_DESCRIPTION += `[${data.quantity.toLocaleString('pt-BR')}] — ${data.name}${typeof data.givenBy != null && data.givenBy ? ` **por ${(client.users.cache.get(data.givenBy)) ? `${(await chars.get(data.givenBy) && await chars.get(data.givenBy).name) ? `${await chars.get(data.givenBy).name} (${data.givenBy})` : `\`${client.users.cache.get(data.givenBy).tag}\``}` : data.givenBy}**` : ""}\n`;
      charInventory.setDescription(INVENTORY_EMBED_DESCRIPTION);
    });
    console.log(`[${charName}]`, `Inventário carregado.`);
  }

  function loadName() {
    console.log(charName);
    charNameEmbed.setTitle(charName);
  }
}


exports.help = {
  name: 'character',
  aliases: ['char', 'perso', 'personagem']
}
