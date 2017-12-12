const logger = require('winston');
const request = require('request');

const WeatherToken = require('./config').openWeatherApi;
const Utils = require('./Utils');


function kelvinToCelsius(kelvin) {
    return Utils.floorToDecimalSpaces(kelvin - 273.15);
}

function kelvinToFahrenheit(kelvin) {
    return Utils.floorToDecimalSpaces(kelvin * 9 / 5 - 459.67);
}

// Meters per second to miles per hour
function mpsToMph(mps) {
    return Utils.floorToDecimalSpaces(mps * 2.2369);
}

function degreeToDirection(deg) {
    // Top = 0 deg, direction going clockwise
    deg = deg % 360;
    if (deg > 0 && deg <= 22.5) {
        return "North";
    } else if (deg > 22.5 && deg <= 67.5) {
        return "Northwest";
    } else if (deg > 67.5 && deg <= 112.5) {
        return "West";
    } else if (deg > 112.5 && deg <= 157.5) {
        return "Southwest";
    } else if (deg > 157.5 && deg <= 202.5) {
        return "South";
    } else if (deg > 202.5 && deg <= 247.5) {
        return "Southeast";
    } else if (deg > 247.5 && deg <= 292.5) {
        return "East";
    } else if (deg > 292.5 && deg <= 337.5) {
        return "Northeast";
    } else if (deg > 337.5) {
        return "North";
    }

    return "???";
}

function getWeather(location) {
    let url = "http://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(location) + "&appid=" + encodeURIComponent(WeatherToken);
    
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => { 
            if (error) {
                logger.error("Error getting weather for " + location, error);
                return reject(error);
            }
            
            if (response.statusCode !== 200) {
                logger.debug("Getting weather for " + location + ": Non 200 response code", response.statusCode);
                return reject();
            }
            
            try {
                let data = JSON.parse(body);
                logger.debug("Got weather for " + location);
                resolve(data);
            } catch(err) {
                logger.debug("Error parsing weather response for " + location, err)
                reject(err);
            }
        });
    })
    .then(data => {
        // Extract the data we are interested in
        let parsedData = {
            location: {
                name: data['name'],
                country: data['sys']['country'],
            },
            current: {
                condition: data['weather'][0]['description'],
                temp: data['main']['temp'],
                humidity: data['main']['humidity'],
                cloudiness: data['clouds']['all'],
                pressure: data['main']['pressure'],
                wind: {
                    speed: data['wind']['speed'],
                    direction: data['wind']['deg'],
                },
            },
            minTemp: data['main']['temp_min'],
            maxTemp: data['main']['temp_max'],
        };


        // "Parse" it more
        parsedData.location = {
            name: parsedData.location.name,
            country: {
                name: parsedData.location.country,
                emoji: '[emoji here]',
            },
        };

        parsedData.current = {
            condition: {
                text: parsedData.current.condition,
                emoji: '[emoji here]',
            },
            temp: {
                kelvin: parsedData.current.temp,
                celsius: kelvinToCelsius(parsedData.current.temp),
                fahrenheit: kelvinToFahrenheit(parsedData.current.temp),
            },
            humidity: parsedData.current.humidity + '%',
            cloudiness: parsedData.current.cloudiness + '%',
            pressure: parsedData.current.pressure,
            wind: {
                speed: {
                    mps: parsedData.current.wind.speed,
                    mph: mpsToMph(parsedData.current.wind.speed),
                },
                direction: {
                    degrees: parsedData.current.wind.direction,
                    text: degreeToDirection(parsedData.current.wind.direction),
                }
            }
        };

        parsedData.maxTemp = {
            kelvin: parsedData.maxTemp,
            celsius: kelvinToCelsius(parsedData.maxTemp),
            fahrenheit: kelvinToFahrenheit(parsedData.maxTemp),
        };

        parsedData.minTemp = {
            kelvin: parsedData.minTemp,
            celsius: kelvinToCelsius(parsedData.minTemp),
            fahrenheit: kelvinToFahrenheit(parsedData.minTemp),
        };

        return parsedData;
    });
}


module.exports = {
    kelvinToCelsius,
    kelvinToFahrenheit,
    mpsToMph,
    degreeToDirection,
    getWeather,
};
