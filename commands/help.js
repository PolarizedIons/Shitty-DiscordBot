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
    
    let aliases = commandObj.commands.filter(c => c !== commandArg);
    if (aliases.length > 1) {
        embed.addField("Aliases", aliases,join(", "));
    }

    embed.addField("Usage", Config.commandPrefix + commandArg + " " + commandObj.usage);

    user.send(embed);
}

function sendAllCommands(user) {
    let commands = Commands.getCommands();
    for (let command of commands) {
        user.send(`**${Config.commandPrefix}${command.commands[0]}** ${command.usage} - *${command.help}*`);
    }
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
            message.author.send(" **=== Start of commands for this bot ===** ");
            sendAllCommands(message.author);
            message.author.send(" **=== End of commands for this bot ===** ");
        }
    },
}
