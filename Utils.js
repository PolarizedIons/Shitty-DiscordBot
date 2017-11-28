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

// Credit to Paulpro here: https://stackoverflow.com/a/7624821
// Modified to suit my style & use cases
function stringLengthSpliiter(str, maxLength, splitChar) {
    splitChar = splitChar || "\n";

    let resultStrs = [];
    while(str.length > maxLength) {
        let splitPos = Math.max(1, str.substring(0, maxLength).lastIndexOf(splitChar));
        resultStrs.push(str.substring(0, splitPos));

        let i = str.indexOf(splitChar, splitPos) + 1;
        if (i < splitPos || i > (splitPos + maxLength)) {
            i = pos;
        }

        str = str.substring(i);
    }
    resultStrs.push(str);
    return resultStrs;
}

module.exports = {
    floorToDecimalSpaces,
    replyToUser,
    removeFromArray,
    stringLengthSpliiter,
};
