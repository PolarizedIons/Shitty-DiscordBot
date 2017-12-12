const EventEmitter = require('events').EventEmitter;
const fs = require('fs');
const path = require('path');

const Discord = require('discord.js');

const config = require('./config');
const Utils = require('./Utils');

class DiscordClient extends EventEmitter {
    constructor() {
        super();
        this.startTime = new Date();
        this.logger = require('winston');
        
        this.eventListeners = {};

        this.client = new Discord.Client();
        this.client.on("debug", d => this.logger.debug("[Discord.js]", d));
        this.client.on("warn", w => this.logger.warn("[Discord.js]", w));
        this.client.on("error", e => this.logger.error("[Discord.js]", e));
        
        setInterval(this.setGameToPing.bind(this), 30 * 1000); // Update ping every 30 seconds

        this._registerEventListeners();
    }

    setGameToPing() {
        if (this.client.user) {
            this.client.user.setGame('Ping: ' + Math.floor(this.client.ping) + 'ms');
        }
    }

    login() {
        this.client.login(config.discord.loginToken)
            .then(() => {
                this.logger.info("Logged into discord!");
            })
            .catch(err => {
                this.logger.error("Error logging into discord!", err);
            });
        
        this.client.on("ready", () => {
            this.logger.info(`Ready! I am ${this.client.user.username}#${this.client.user.discriminator}, and in ${this.client.guilds.size} guilds!`);
            this.logger.debug("Guilds:", this.client.guilds.map(guild => `${guild.name} (owner: ${guild.member(guild.ownerID).user.username}#${guild.member(guild.ownerID).user.discriminator})`));
        });
    }

    _registerEventListeners() {
        fs.readdir(path.join(__dirname, "event-listeners"), (err, files) => {
            if (err) {
                this.logger.error("Couldn't read the 'event-listeners' directory!");
                return;
            }

            files.forEach(file => {
                this.logger.debug("Registered event-listener: '" + file + "'");
                let listener = require(path.join(__dirname, "event-listeners", file));
                listener(this);
            });
        });


        this.client.on("message", message => {
            if (message.author !== this.client.user) {
                this.emit("message", message);
            }
        });
    }

    get uptime() {
        return Utils.floorToDecimalSpaces(((new Date()) - this.startTime) / 1000);
    }

    get user() {
        return this.client.user;
    }
}

module.exports = DiscordClient;
