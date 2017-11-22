const Utils = require('./Utils');

let client;
let waitingFor = [];

function initListener() {
    client.on("message", (message) => {
        waitingFor.forEach(({resolve, user, channel}) => {
            if (message.channel === channel && message.author === user) {
                Utils.removeFromArray(waitingFor, {resolve, user, channel});
                resolve(message);
            }
        })
    })
}

// Both are the objects from discord.js
function waitForMessage(channel, user, timeout = 30) {
    return new Promise((resolve, reject) => {
        if (client === undefined) {
            client = channel.client;
            initListener();
        }
        waitingFor.push({resolve, user, channel});
        console.log("waiting for reply from ", user.username)
        setTimeout(()=> {
            Utils.removeFromArray(waitingFor, {resolve, user, channel});
            reject(false);
        }, timeout * 1000);
    });
}

module.exports = waitForMessage;
