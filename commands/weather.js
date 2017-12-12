const Discord = require('discord.js');

const WeatherAPI = require('../WeatherAPI');
const WeatherToken = require('../config').openWeatherApi;
const Utils = require('../Utils');

module.exports = {
    commands: ['weather', 'w'],
    help: "Lets you know about the weather",
    usage: "<location>",
    exec(client, command, message) {
        if (WeatherToken.length === 0) {
            return Utils.replyToUser(message, "Sorry :(, the owner bot this bot does not have a OpenWeather api key set");
        }

        let args = message.content.split(" ").slice(1);

        if (args.length < 1) {
            return Utils.replyToUser(message, "You must specify a location!");
        }

        let location = args.join(" ");
        WeatherAPI.getWeather(location)
            .then(data => {
                let embed = new Discord.RichEmbed();
                embed.setTitle(`Weather for ${data.location.name}, ${data.location.country.name}`);
                embed.addField("Current Temp", `${data.current.temp.kelvin}K / ${data.current.temp.celsius}°C / ${data.current.temp.fahrenheit}°F`);
                embed.addField("Min Temp", `${data.minTemp.kelvin}K / ${data.minTemp.celsius}°C / ${data.minTemp.fahrenheit}°F`);
                embed.addField("Max Temp", `${data.maxTemp.kelvin}K / ${data.maxTemp.celsius}°C / ${data.maxTemp.fahrenheit}°F`);
                embed.addField("Condition", data.current.condition.text);
                embed.addField("Humidity", data.current.humidity);
                embed.addField("Cloudiness", data.current.cloudiness);
                embed.addField("Pressure", `${data.current.pressure} hPa`);
                embed.addField("Wind", `${data.current.wind.direction.text} (${data.current.wind.direction.degrees}°) ${data.current.wind.speed.mps} m.s⁻¹ / ${data.current.wind.speed.mph} mph`)

                message.channel.send(embed);
            })
            .catch(err => {
                console.log('er', err)
                return Utils.replyToUser(message, "An error ocurred getting the weather for '" + location + "'");
            });
    },
}