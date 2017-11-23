const Discord = require('discord.js');

const WaitForReply = require('../WaitForReply');
const Utils = require('../Utils');

module.exports = {
    commands: ['replytest'],
    help: "test the reply message thingy",
    usage: "",
    exec(client, command, commandMessage) {
        commandMessage.channel.send("I'm waiting for a reply from <@" + commandMessage.author.id + ">")
            .then(message => {
                return WaitForReply(commandMessage.channel, commandMessage.author);
            })
            .then(replyMessage => {
                Utils.replyToUser(commandMessage, "You replied!");
            })
            .catch(() => {
                Utils.replyToUser(commandMessage, "Timeout!");
            });
    },
}
