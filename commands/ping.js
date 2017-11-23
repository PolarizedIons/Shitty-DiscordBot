module.exports = {
    commands: ['ping'],
    help: "Ping-Pong! Let's you know the bot is still working",
    usage: "",
    exec(client, command, message) {
        // message.channel.send('<@' + message.author.id + '> Pong!');
        Promise.resolve([])
            .then(() => message.react("🇵"))
            .then(() => message.react("🇴"))
            .then(() => message.react("🇳"))
            .then(() => message.react("🇬"));
    },
}