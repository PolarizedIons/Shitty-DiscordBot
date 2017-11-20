function floorToDecimalSpaces(value, decimalSpaces = 2) {
    return Math.floor(value * 10** decimalSpaces) / 10 ** decimalSpaces;
}


module.exports = {
    floorToDecimalSpaces,
};
