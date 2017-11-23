const fs = require('fs');
const path = require('path');

const logger = require('winston');

const config = require('../config');
const commands = require('../commands');

function listener(client) {
    commands.loadCommands();

    client.on("message", msg => {
        if (msg.content.startsWith(config.commandPrefix)) {
            let command = msg.content.split(" ")[0].substring(1);
            commands.runCommand(client, command, msg);
        }
    })
}

module.exports = listener;