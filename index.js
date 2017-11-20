const winston = require('winston');
winston.default.transports.console.level='debug';
winston.transports.Console.level = 'debug';


// Do stuff here


const DiscordClient = require('./DiscordClient');
const Client = new DiscordClient();
Client.login();
