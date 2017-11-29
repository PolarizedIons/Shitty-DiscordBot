function floorToDecimalSpaces(value, decimalSpaces = 2) {
    return Math.floor(value * 10** decimalSpaces) / 10 ** decimalSpaces;
}

function mentionString(user) {
    return `<@${user.id}>`;
}

function replyToUser(messageObject, reply) {
    messageObject.channel.send(mentionString(messageObject.author) + ' ' + reply);
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

function progressBarString(percent, maxLength, fillCharacter, remainCharacter) {
    fillCharacter = fillCharacter === undefined ? "=" : fillCharacter;
    remainCharacter = remainCharacter === undefined ? " " : remainCharacter;

    let complete = Math.round(percent/100.0 * maxLength);
    let remaining = maxLength - complete;

    return Array(Math.max(0, complete)).fill(fillCharacter).join("") + Array(Math.max(0, remaining)).fill(remainCharacter).join("");
}

module.exports = {
    floorToDecimalSpaces,
    mentionString,
    replyToUser,
    removeFromArray,
    stringLengthSpliiter,
    progressBarString,
};
