exports.run = async (client, message) => {
    if (message.author.bot || !message.guild) return;
    const prefix = (!client.isTesting) ? "." : ".?";


    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    command = client.commands.get(command);

    if (!command) return;

    command.run(client, message, args);
}