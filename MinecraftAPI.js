const logger = require('winston');
const request = require('request');


function getUUID(username) {
    // https://api.mojang.com/users/profiles/minecraft/<username>
    return new Promise((resolve, reject) => {
        request(`https://api.mojang.com/users/profiles/minecraft/${username}`, (error, response, body) => {
            if (error) {
                logger.error("Error getting uuid for " + username, error);
                return reject(error);
            }
            
            if (response.statusCode === 204) {
                logger.debug("Getting uuid for " + username + " => Doesn't exist");
                return resolve(false);
            }
            
            let profile = JSON.parse(body);
            logger.debug("Got uuid for " + username + " => " + profile.id);
            resolve(profile);
        });
    });
}

module.exports = {
    getUUID,
};
