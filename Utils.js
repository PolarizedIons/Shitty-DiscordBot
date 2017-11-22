function floorToDecimalSpaces(value, decimalSpaces = 2) {
    return Math.floor(value * 10** decimalSpaces) / 10 ** decimalSpaces;
}

function replyToUser(messageObject, reply) {
    messageObject.channel.send('<@' + messageObject.author.id + '> ' + reply);
}

function removeFromArray(array, value) {
    let index = array.indexOf(value);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

module.exports = {
    floorToDecimalSpaces,
    replyToUser,
    removeFromArray,
};
