const EventEmitter = require('events').EventEmitter;


let client;

let numberEmojis = ["0⃣", "1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣"];
let EMOJIS = {
        YES_NO: {
            '✅': true,
            '❎': false,
        },
        NUMBERS(amount, startAtZero) {
            let start = startAtZero ? 0 : 1;
            let end = startAtZero ? amount : amount + 1;
            let resultEmojis = {};
            for (let i = start; i < end; i++) {
                resultEmojis[numberEmojis[i]] = i;
            }

            return resultEmojis;
        }
}

class ChoiceMessage extends EventEmitter {
    constructor(channel, user, message, {timeout, deleteWhenDone, emojis}) {
        super();
        timeout = timeout || 30;
        deleteWhenDone = deleteWhenDone || false;
        emojis = emojis || EMOJIS.YES_NO;

        if (client === undefined) {
            client = channel.client;
        }

        channel.send(message)
            .then(sentMessage => {
                let reactions = [];
                for (let emoji of Object.keys(emojis)) {
                    reactions.push(sentMessage.react(emoji));
                }

                Promise.all(reactions)
                    .then(() => {
                        let collector = sentMessage.createReactionCollector(
                            (reaction, reactingUser) => user.id === reactingUser.id && Object.keys(emojis).indexOf(reaction.emoji.name) !== -1,
                            { time: timeout * 1000, max: 1 }
                        );
        
                        // collector.on("collect", r => console.log("reacted ", r));
                        collector.on("end", collected => {
                            if (collected.size === 0) {
                                this.emit("timeout");
                            }
                            else {
                                let choiceEmoji = collected.first().emoji.name;
                                this.emit("choice", emojis[choiceEmoji]);
                            }
        
                            if (deleteWhenDone) {
                                sentMessage.delete();
                            }
                    });
                });
            });
    }
}


module.exports = {
    ChoiceMessage,
    EMOJIS,
};
