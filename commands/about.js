const Discord = require('discord.js');

const Utils = require('../Utils');

const author = "PolarizedIons";
const version = require('../package.json').version;
const source = "https://github.com/PolarizedIons/Shitty-DiscordBot";

module.exports = {
    commands: ['about'],
    help: "Show information of the bot",
    usage: "",
    exec(client, command, message) {
        let connectionUptime = Utils.floorToDecimalSpaces(client.client.uptime / 1000);
        let name = message.guild === null ? client.user.username : message.guild.me.nickname;

        let embed = new Discord.RichEmbed();
        embed.setThumbnail(client.user.displayAvatarURL);
        embed.addField("Name", name);
        embed.addField("Version", version);
        embed.addField("Author", author);
        embed.addField("Source", source);
        embed.addField("Bot Uptime", client.uptime + 's');
        embed.addField("Connection Uptime", connectionUptime + 's');
        embed.addField("Ping", Utils.floorToDecimalSpaces(client.client.ping, 1) + 'ms');

        message.channel.send(embed);
    },
}