// Setup empty JS object to act as endpoint for all routes
projectData = {}

// Get the Weather API
const openWeatherAPI = require('./weather-service.json');

// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Spin up the server
const port = 8000;
const server = app.listen(port, ()=>{console.log(`running on localhost: ${port}`)})

// Initialize all route with a callback function
app.get('/api/projectData', getProjectData)

// Callback function to complete GET '/all'
function getProjectData(req, res) {
    console.log(projectData);
    res.send(projectData)
}

// Post Route
app.post('/api/projectData', postProjectData)

// Callback function to complete POST '/'
function postProjectData(req, res) {
    
    if(req.body.zip && req.body.feeling){
        try {
            const weatherData = await fetchWeatherData(req.body.zip);

            const temperature = weatherData.main;

            const weather = weatherData.weather;
    
            projectData = {
                zip: req.body.zip,
                prediction: req.body.prediction,
                temperature: temperature,
                weather: weather
            };
            
            console.log(projectData);
            res.send(projectData);
        }
        catch(error)
        {
            console.log(`An error occurred while posting the data. Please retry again. ${error}`);
        }
    }
    else {
        res.send("Please check the values you have entered for Zip and Feeling. Something seems to be wrong!");
    }
    data.push(req.body);
}

// Fetch weather data from OpenWeatherAPI
async function fetchWeatherData(zip) {

    try {
        const response = await fetch(`${openWeatherAPI.baseUrl}q=${zip}&appid=${openWeatherAPI.apiKey}`);
        const weatherData = await response.json();
        return weatherData;
    }
    catch (error) {
        console.log(`An error occurred while fetching the weather data. Please retry again. ${error}`)
    }

};