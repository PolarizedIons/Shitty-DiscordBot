function floorToDecimalSpaces(value, decimalSpaces = 2) {
    return Math.floor(value * 10** decimalSpaces) / 10 ** decimalSpaces;
}

function replyToUser(messageObject, reply) {
    messageObject.channel.send('<@' + messageObject.author.id + '> ' + reply);
}

module.exports = {
    floorToDecimalSpaces,
    replyToUser,
};
