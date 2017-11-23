const Discord = require('discord.js');

const {ChoiceMessage, EMOJIS} = require('../ChoiceMessage');
const Utils = require('../Utils');

module.exports = {
    commands: ['choicetest'],
    help: "test the choise message thingy",
    usage: "",
    exec(client, command, message) {
        let choice = new ChoiceMessage(message.channel, message.author, "Answer yes/no", {deleteWhenDone:true, timeout:10, emojis: EMOJIS.NUMBERS(3)});
        choice.on("timeout", () => {
            Utils.replyToUser(message, "Timed out");
        });
        choice.on("choice", choice => {
            Utils.replyToUser(message, "Choice resolved to " + choice);
        });
    },
}