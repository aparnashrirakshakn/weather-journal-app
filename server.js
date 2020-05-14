// Setup empty JS object to act as endpoint for all routes
projectData = {}

// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');

// require fetch
const fetch = require("node-fetch");

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
const port = 8040;
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
    
    if(req.body.zip && req.body.prediction){
        try {
            this.projectData = req.body;
            
            console.log(projectData);
            res.send(projectData);
        }
        catch(error)
        {
            console.log(`An error occurred while posting the data. Please retry again. ${error}`);
        }
    }
    else {
        res.send("Please check the values you have entered for Zip and Prediction. Something seems to be wrong!");
    }
    
}
