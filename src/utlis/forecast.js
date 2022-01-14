const request = require('postman-request')

const forecast = (latitude, longitude, callback) => {
    
    const url = 'http://api.weatherstack.com/current?access_key=1851dab03bd76cdc396e81badfb4f09d&query=' + latitude + ',' + longitude + '&units=m'

    request({url, json: true}, (error, {body}) => {
        if(error){
            callback('Unable to connect to server.', undefined)
        } else if(body.error){
            callback('Unable to find Location', undefined)
        }else{

            callback(undefined, {
                CurrentTemp: body.current.temperature,
                feelsLike: body.current.feelslike,
                wheaterDescription: body.current.weather_descriptions[0]
            })
        }
    })
}

module.exports = forecast