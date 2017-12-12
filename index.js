try {
    const winston = require('winston');
    winston.default.transports.console.level='debug';
    winston.transports.Console.level = 'debug';
} catch (err) {
    if (err.code !== "MODULE_NOT_FOUND") {
        throw err;
    }

    console.error("Remember to install dependencies!");
    process.exit(1);
}


try {
    require('./config')
} catch (err) {
    if (err.code !== "MODULE_NOT_FOUND") {
        throw err;
    }

    console.error("Remember to setup your config.js from config.example.js!");
    process.exit(2);
}


const DiscordClient = require('./DiscordClient');
const Client = new DiscordClient();
Client.login();
