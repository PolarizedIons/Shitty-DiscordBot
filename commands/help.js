const Discord = require('discord.js');

const Config = require('../config');
const Commands = require('.');
const Utils = require('../Utils');

function sendCommandInfo(user, commandObj, commandArg) {
    if (commandArg === undefined) {
        commandArg = commandObj.commands[0];
    }

    let embed = new Discord.RichEmbed();
    embed.addField("Command", Config.commandPrefix + commandArg);
    embed.addField("Description", commandObj.help);
    
    if (commandObj.commands.length > 1) {
        embed.addField("Aliases", commandObj.commands.join(", "));
    }

    embed.addField("Usage", Config.commandPrefix + commandArg + " " + commandObj.usage);

    user.send(embed);
}

function sendAllCommands(user) {
    let commands = Commands.getCommands();
    let commandTexts = [];

    commandTexts.push(" **=== Start of commands for this bot ===** ");
    for (let command of commands) {
        commandTexts.push(`**${Config.commandPrefix}${command.commands[0]}** ${command.usage} - *${command.help}*`);
    }
    commandTexts.push(" **=== End of commands for this bot ===** ");

    Utils.stringLengthSpliiter(commandTexts.join("\n"), 2000).forEach(msgText => user.send(msgText));
}

module.exports = {
    commands: ['help'],
    help: "Shows the commands",
    usage: "[command]",
    exec(client, command, message) {
        let args = message.content.split(" ").slice(1);
        if (args.length > 1) {
            return Utils.replyToUser(message, "You can only spesify one command");
        }

        if (args.length === 1) {
            // One command
            let requestCommand = Commands.commandsDictionary()[args[0].toLowerCase()];
            if (!requestCommand) {
                return Utils.replyToUser(message, "Unknown command");
            }
            sendCommandInfo(message.author, requestCommand, args[0].toLowerCase());
        }
        else {
            // All commands
            sendAllCommands(message.author);
        }
    },
}
