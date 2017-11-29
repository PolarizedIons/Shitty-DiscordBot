const EventEmitter = require('events').EventEmitter;

const logger = require('winston');

const Utils = require('./Utils');

const POLL_CHOICE_REACTIONS = ["0⃣", "1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", 
        "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "🇿"];

class PollMessage extends EventEmitter {
    // channel & user are discord.js objects, pollMessage a string, pollChoices an Array, and timeout a number in seconds
    constructor(channel, user, pollMessage, pollChoices, timeout, postResult) {
        super();
        postResult = postResult === undefined ? false : postResult;

        logger.debug("New poll '" + pollMessage + "', with " + pollChoices.length + " choices");

        if (pollChoices.length > POLL_CHOICE_REACTIONS.length) {
            return channel.send(Utils.mentionString(user) + ", too many options!");
        }

        let message = `${Utils.mentionString(user)} asks, \`${pollMessage}\`\n\nReact to this message with one of the following to vote! Poll ends in ${timeout} seconds.\n`;

        for (let [i, option] of pollChoices.entries()){
            message += `[ ${POLL_CHOICE_REACTIONS[i]} ] = ${option}\n`;
        }

        let multipleMessages = Utils.stringLengthSpliiter(message, 2000);

        channel.send(multipleMessages[0])
            .then(message => {
                if (multipleMessages.length === 1) {
                    return message;
                }

                let remainingMessages = multipleMessages.slice(1);
                // Not a message, but so we can pass along the sent message object
                remainingMessages.push(new Promise(resolve => resolve(message)));

                return Promise.all(remainingMessages);
            })
            .then(message => {
                let reactions = [];
                for (let emoji of POLL_CHOICE_REACTIONS.slice(0, pollChoices.length)) {
                    reactions.push(message.react(emoji));
                }

                // Not a reaction, but so we can pass along the sent message object
                reactions.push(message);
                return Promise.all(reactions);
            })
            .then(message => {
                message = message[message.length -1]; // Promise.all returns an Array of results

                setTimeout(() => {
                    let resultVotes = Object.assign(...pollChoices.map(choice => ({[choice]: 0})));
                    let totalVotes = 0;

                    let allowedVotes = POLL_CHOICE_REACTIONS.slice(0, pollChoices.length);
                    for (let reactionEmoji of message.reactions.array()) {
                        if (allowedVotes.indexOf(reactionEmoji.emoji.name) === -1) {
                            continue;
                        }

                        let key = pollChoices[POLL_CHOICE_REACTIONS.indexOf(reactionEmoji.emoji.name)];
                        resultVotes[key] = reactionEmoji.count - 1;  // -1 to remove our own "vote", because we reacted with all the options
                        totalVotes += reactionEmoji.count - 1;
                    }

                    this.emit("results", resultVotes);

                    if (postResult) {

                        let resultText = `${Utils.mentionString(user)}'s poll has finished with ${totalVotes} votes!\n\n`;
                        
                        for (let option in resultVotes) {
                            let voteCount = resultVotes[option];
                            let percent = Math.round(voteCount / totalVotes * 100);
                            percent = isNaN(percent) ? 0 : percent;
                            let progessBar = Utils.progressBarString(percent, 16, "█", "");
                            resultText += `${progessBar} ${percent}% - ${option}\n\n`;
                        }

                        for (let resultMsg of Utils.stringLengthSpliiter(resultText, 2000)) {
                            channel.send(resultMsg);
                        }
                    }

                }, timeout * 1000);
            })
            .catch(err => {
                channel.send(`An error occured with ${Utils.mentionString(user)}'s poll`);
                logger.error("Error with " + user.username + "'s poll");
                logger.error(err);
            });
    }
}

module.exports = PollMessage;
