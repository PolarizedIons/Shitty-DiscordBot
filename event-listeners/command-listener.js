const fs = require('fs');
const path = require('path');

const logger = require('winston');

const config = require('../config');

let commands;

function initCommandListeners() {
    commands = {};
    
    fs.readdir(path.join(__dirname, "..", "commands"), (err, files) => {
        if (err) {
            logger.error("Couldn't read the 'command' directory!");
            return;
        }

        files.forEach(file => {
            logger.debug("Registered command-listener: '" + file + "'");
            let commandListener = require(path.join(__dirname, "..", "commands", file));
            
            commandListener.commands.forEach(commandAlias => {
                commands[commandAlias] = commandListener;
            })
        });
    });
}

function listener(client) {
    if (commands === undefined) {
        initCommandListeners();
    }

    client.on("message", msg => {
        if (msg.content.startsWith(config.commandPrefix)) {
            let command = msg.content.split(" ")[0].substring(1);
            if (command in commands) {
                commands[command].exec(client, command, msg);
            }
        }
    })
}

module.exports = listener;