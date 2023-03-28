module.exports.genToken = function genToken(length) {
    let token = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < characters.length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}

module.exports.randomNumber = function randomNumber(maxN) {
    let randomNumber = Math.ceil(Math.random() * maxN);
    return randomNumber;
}

module.exports.randomPosition = function randomPosition(era_id) {
    let randomPosition = Math.ceil(Math.random() * 5); //5 is the number of squares for each
    return ((era_id * 5) - 5) + randomPosition;
}