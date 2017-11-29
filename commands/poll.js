const Discord = require('discord.js');

const Config = require('../config');
const PollMessage = require("../PollMessage");
const Utils = require('../Utils');

module.exports = {
    commands: ['poll'],
    help: "Ask a poll",
    usage: "<poll question>? <option>, <option>[, option, option, option, ...]",
    exec(client, command, message) {
        let msg = message.content.substring(Config.commandPrefix.length + command.length);
        let questionmarkIndex = msg.indexOf("?");
        if (questionmarkIndex === -1) {
            return Utils.replyToUser(message, "Your question must end with a question mark")
        }

        let question = msg.substring(0, questionmarkIndex + 1);
        if (question.length === 1) {
            return Utils.replyToUser(message, "You must actually ask a question!");
        }

        let options = msg.substring(questionmarkIndex + 1).trim().split(",").map(o => o.trim()).filter(o => !!o);
        if (options.length < 2) {
            return Utils.replyToUser(message, "You must spesify at least two options");
        }

        new PollMessage(message.channel, message.author, question, options, 60, true);
    },
}