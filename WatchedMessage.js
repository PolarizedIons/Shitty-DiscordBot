const EventEmitter = require('events').EventEmitter;

const logger = require('winston');

const Utils = require('./Utils');


let messages = [];
let client;

function notifyMessage(event, eventArgs, message) {
    messages.forEach(watchedMessage => {
        if (message.id === watchedMessage.message.id) {
            watchedMessage.emit(event, ...eventArgs);
        }
    });
}

function initListeners() {
    client.on("messageDelete", message => {
        notifyMessage("messageDelete", [message], message);
    });

    client.on("messageReactionAdd", (reaction, user) => {
        if (user.id === client.user.id) { return; }
        notifyMessage("messageReactionAdd", [reaction, user], reaction.message);
    });

    client.on("messageReactionRemove", (reaction, user) => {
        if (user.id === client.user.id) { return; }
        notifyMessage("messageReactionRemove", [reaction, user], reaction.message);
    });

    client.on("messageReactionRemoveAll", message => {
        notifyMessage("messageReactionRemoveAll", [message], message);
    });

    client.on("messageUpdate", (oldMessage, newMessage) => {
        notifyMessage("messageUpdate", [oldMessage, newMessage], oldMessage);
    });
}

class WatchedMessage extends EventEmitter {
    constructor(message) {
        super();
        messages.push(this);
        this.message = message;
        logger.debug("Watching message " + message.id + " by " + message.author.username);

        if (client === undefined) {
            client = message.client;
            initListeners();
        }
    }

    stopWatching() {
        logger.debug("Stopped watching message " + this.message.id + " by " + this.message.author.username);
        Utils.removeFromArray(messages, this);
    }
}

module.exports = WatchedMessage;
