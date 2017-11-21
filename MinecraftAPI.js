const url = require('url');

const logger = require('winston');
const request = require('request');
const mcprotocol = require('minecraft-protocol');

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

function parseMotd(motd) {
    if (typeof motd == 'string') {
        // Old format
        return motd.replace(/§[0-9a-fk-or]/g, '');
    }
    else {
        // JSON format
        let message = motd.text;
        
        if (motd.extra) {
            motd.extra.forEach((motdExtra) => {
                message += parseMotd(motdExtra);
            })
        }

        return message;
    }
}

function pingServer(server) {
    
    if (server.includes("::") && !server.includes("[")) {
        server = "[" + server + "]";
    }
    let ipv6 = server.includes("[");

    let parsed = url.parse('http://' + server);
    let host = parsed.hostname;
    let port = parsed.port || 25565;

    logger.debug("Pinging server " + host + ":" + port + " (" + server + ")");

    return new Promise((resolve, reject) => {
        try {
            mcprotocol.ping({'host': host, 'port': port}, (err, data) => {
                if (!data) {
                    logger.debug("No data");
                    return reject();
                }

                resolve({
                    host: ipv6 ? '[' + host + ']' : host,
                    port,
                    version: data.version.name,
                    motd: parseMotd(data.description),
                    icon: data.favicon,
                    players: {
                        sample: (data.players.sample || []).map(player => player.name),
                        online: data.players.online,
                        slots: data.players.max,
                    },
                });
            });
        } catch(err) {
            reject(err);
        }
    });
}


module.exports = {
    getUUID,
    pingServer,
};
