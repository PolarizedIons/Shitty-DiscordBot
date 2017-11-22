const EventEmitter = require('events').EventEmitter;

const logger = require('winston');

const Utils = require('./Utils');


let messages = [];
let client;

function notifyMessage(event, eventArgs, message) {
    messages.forEach(watchedMessage => {
        if (message === watchedMessage.message) {
            watchedMessage.emit(event, ...eventArgs);
        }
    });
}

function initListener() {
    client.on("messageDelete", message => {
        notifyMessage("messageDelete", [message], message);
    });

    client.on("messageReactionAdd", (reaction, user) => {
        if (user === client.user) { return; }
        notifyMessage("messageReactionAdd", [reaction, user], reaction.message);
    });

    client.on("messageReactionRemove", (reaction, user) => {
        if (user === client.user) { return; }
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
        logger.debug("Watching message " + message.id + " by " + message.author);

        if (client === undefined) {
            client = message.client;
            initListener();
        }
    }

    stopWatching() {
        Utils.removeFromArray(messages, this);
    }
}

module.exports = WatchedMessage;
