const Discord = require('discord.js');

const Utils = require('../Utils');

module.exports = {
    commands: ['uptime'],
    help: "Show the uptime of the bot",
    exec(client, command, message) {
        // message.channel.send('<@' + message.author.id + '> Bot Uptime: ' + client.uptime + 's, Connection Uptime: ' + Math.floor(client.client.uptime / 1000) + 's');
        let connectionUptime = Utils.floorToDecimalSpaces(client.client.uptime / 1000);

        let embed = new Discord.RichEmbed();
        embed.addField("Bot Uptime", client.uptime + 's');
        embed.addField("Connection Uptime", connectionUptime + 's');
        embed.addField("Ping", client.client.ping + 'ms');

        message.channel.send(embed);
    },
}