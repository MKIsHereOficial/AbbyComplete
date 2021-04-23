const Database = require('../../database.js');
const {MessageEmbed} = require('discord.js');

exports.run = async(client, message, args) => {
    const db = await Database("chars");

    const data = await db.exists(message.author.id);

    const embed = new MessageEmbed()
    .setTitle(`Documento: ${db.database.name}/${data.key}`)
    .addField('Existe', data.exists)
    .addField('Valor', "```json\n"+JSON.stringify(data.value, null, 1)+"```")
    .setColor('BLUE');
    
    return message.reply(embed);
}

exports.help = {
    name: 'test',
    aliases: ['teste', 'test-function', 'early-access']
}