const Discord = require('discord.js');

const WatchedMessage = require('../WatchedMessage');

module.exports = {
    commands: ['watchtest'],
    help: "test the watched message thingy",
    exec(client, command, message) {
        message.channel.send("I'm watching this message for reactions")
            .then(message => {
                let watchedMessage = new WatchedMessage(message);
                
                watchedMessage.on("messageReactionAdd", (reaction, user) => {
                    message.channel.send(user.username + " reacted with " + reaction.emoji);
                    message.react(reaction.emoji);
                });

                watchedMessage.on("messageReactionRemove", (reaction, user) => {
                    watchedMessage.stopWatching();
                    watchedMessage = undefined; // Let it be garbage collected
                    message.channel.send(" no longer watching message " + message.id);
                })
            });
    },
}