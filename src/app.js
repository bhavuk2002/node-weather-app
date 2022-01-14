const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utlis/geocode')
const forecast = require('./utlis/forecast')

const app = express()
const port = process.env.PORT || 3000 // first one is for heroku and another for our local machine i.e 3000

// path for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views') // to change path of views to anything
const partialsPath = path.join(__dirname, '../templates/partials')
// console.log(__dirname)
// console.log(__filename)

// setup handle bars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static directory to serve
app.use(express.static(publicDirectoryPath))

// as we have now a index.html it automatically comes at this place so we will never see the Hello Express, so its of no use now

// app.get('', (req, res) => {
//     res.send('Hello Express!')
// })

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Bhavuk Mittal'
    })
})

app.get('/help', (req, res) => {
    res.render('help',{
        helpText: 'Some Helpful text',
        title: 'Help',
        name: 'Bhavuk Mittal'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Bhavuk Mittal'
    })
})

app.get('/weather', (req, res) => {

    address = req.query.address

    if(!address){
        return res.send(
            {
                error: 'Please Input an address'
            }
        )
    }

    geocode(address, (error, {latitude, longitude, location} = {}) => { // we use {} bec it doesnt throw error of we pass wrong obj
        
        if(error){
            return res.send(
                {
                    error
                }
            )
        }
    
        forecast( latitude, longitude, (error, {wheaterDescription, CurrentTemp, feelsLike}) => {
            
            if(error){
                return res.send(
                    {
                        error
                    }
                )
            }

            res.send(
                {
                    forecast: 'It is ' + wheaterDescription + '. Temperature is ' + CurrentTemp + ' but it feels like ' + feelsLike + ' degree out.',
                    location: location
                }
            )
        })
    })


    
})


app.get('/help/*', (req, res) => {
    res.render('404page', {
        title: 'Error',
        pageError: 'Help article not found',
        name: 'Bhavuk Mittal'
    })
})

app.get('*', (req, res) => {
    res.render('404page', {
        title: 'Error',
        pageError: 'Page not found',
        name: 'Bhavuk Mittal'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})