const Discord = require('discord.js');

const MinecraftAPI = require('../MinecraftAPI');
const Utils = require('../Utils');

module.exports = {
    commands: ['mcuser'],
    help: "Give info about a minecraft username",
    exec(client, command, message) {
        let args = message.content.split(" ").slice(1);
        if (args.length < 1) {
            return Utils.replyToUser(message, "You must specify a username!");
        }
        else if (args.length > 2) {
            return Utils.replyToUser(message, "You can only specify one username");
        }

        MinecraftAPI.getUUID(args[0])
            .then(profile => {
                if (profile === false) {
                    return Utils.replyToUser(message, "Username does not exist!");
                }
                
                let embed = new Discord.RichEmbed();
                embed.setThumbnail(`https://crafatar.com/avatars/${profile.id}?overlay`);
                embed.addField("Username", profile.name);
                embed.addField("UUID", profile.id);
                embed.addField("Legacy", profile.legacy ? "Yes" : "No");
                embed.addField("Demo", profile.demo ? "Yes" : "No");
                message.channel.send(embed);
            });
    },
}