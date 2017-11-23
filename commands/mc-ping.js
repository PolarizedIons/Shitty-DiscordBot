const Discord = require('discord.js');

const MinecraftAPI = require('../MinecraftAPI');
const Utils = require('../Utils');

module.exports = {
    commands: ['mcping'],
    help: "Ping a minecraft server",
    usage: "<host>[:port]",
    exec(client, command, message) {
        let args = message.content.split(" ").slice(1);

        if (args.length === 0) {
            return Utils.replyToUser(message, "You must spesify a ip/hostname!");
        }
        else if (args.length > 1) {
            return Utils.replyToUser(message, "You can only ping one server at at time!");
        }

        MinecraftAPI.pingServer(args[0])
            .then(serverData => {
                let embed = new Discord.RichEmbed();
                // embed.setThumbnail(serverData.icon);
                embed.addField("Server:", `${serverData.host}:${serverData.port}`);
                embed.addField("Version", serverData.version);
                embed.addField("MOTD", serverData.motd);
                embed.addField("Players", `${serverData.players.online}/${serverData.players.slots}`);

                if (serverData.players.sample.length > 0) {
                    embed.addField("Online Players Sample", serverData.players.sample.join(", "));
                }

                message.channel.send(embed);
            })
            .catch(() => {
                Utils.replyToUser(message, "Coundn't ping " + args[0]);
            });
    },
}