const fs = require('fs');
const path = require('path');

const logger = require('winston');


let commands;

function loadCommands() {
    commands = {};

    fs.readdir(path.join(__dirname), (err, files) => {
        if (err) {
            logger.error("Couldn't read the 'command' directory!");
            return;
        }

        files.forEach(file => {
            if (file === 'index.js') {  // Ignore ourselves
                return; // continue
            }

            logger.debug(`Registered command-listener: '${file}'`);
            let commandListener = require(path.join(__dirname, file));
            
            commandListener.commands.forEach(commandAlias => {
                commands[commandAlias] = commandListener;
            })
        });
    });
}

function runCommand(client, command, message) {
    if (commands === undefined) {
        loadCommands();
    }

    if (command in commands) {
        commands[command].exec(client, command, message);
    }
}

function getCommands() {
    return commands;
}

function getCommandsSet() {
    return new Set(Object.values(commands));
}

module.exports = {
    loadCommands,
    runCommand,
    getCommands: getCommandsSet,
    commandsDictionary: getCommands,
};
