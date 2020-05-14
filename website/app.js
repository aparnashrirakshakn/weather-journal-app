/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

// Get the Weather API
const openWeatherAPI = {
    "baseUrl": "https://api.openweathermap.org/data/2.5/weather?",
    "apiKey": "<Your API Key Here>",
    "options": "&units=imperial"
};

// Update the UI with project data
async function UpdateUI() {
    try {
        // clear entered data
        document.querySelector("#zip").value = "";
        document.querySelector("#feelings").value = "";

        // get the project data
        const data = await getProjectData();
        
        // create log entry
        createLogEntry(data)
    }
    catch(error) {
        console.log("Something went wrong while updating the UI. Please try again later!");
    }
}

// create log entry
function createLogEntry(data) {

    const weatherDataEntry = document.createDocumentFragment();

    const logDate = document.createElement("div");
    logDate.id = "date";
    logDate.innerHTML = `<strong>Log date: </strong> ${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`;

    const temperature = document.createElement("div");
    temperature.id = "temp";
    temperature.innerHTML = `<span>Imperial Units <br><strong>Min Temp: </strong>${data.temperature.temp_min}, <strong>Max Temp: </strong>${data.temperature.temp_max}</span>`;

    const weather = document.createElement("div");
    weather.id = "content";
    weather.innerHTML = `<span><strong>Weather today</strong>: ${data.weather[0].main} - ${data.weather[0].description}</span> <br/><strong>User Prediction: </strong>${data.prediction}<hr />`;
    
    weatherDataEntry.appendChild(logDate);
    weatherDataEntry.appendChild(temperature);
    weatherDataEntry.appendChild(weather);

    // append the entry to the UI
    const logEntryRef = document.querySelector("#entryHolder");
    logEntryRef.insertBefore(weatherDataEntry, logEntryRef.querySelector("#date"));
}

// get project data
async function getProjectData () {
    try {
        const response = await fetch("/api/projectData");
        const body = await response.json();
        return body;
    } 
    catch (error) {  
        console.log("Error while fetching project Data: " + error);
    };
  };
  

// Fetch weather data from OpenWeatherAPI
async function fetchWeatherData(zip) {

    try {
        const url = `${openWeatherAPI.baseUrl}q=${zip}&appid=${openWeatherAPI.apiKey}${openWeatherAPI.options}`;
        const response = await fetch(url);
        const weatherData = await response.json();
        return weatherData;
    }
    catch (error) {
        console.log(`An error occurred while fetching the weather data. Please retry again. ${error}`)
    }

};

// Post project data
async function postProjectData() {

    const postData = {
        zip: document.querySelector("#zip").value,
        prediction: document.querySelector("#feelings").value
    };

    if(postData.zip && postData.prediction){

        const weatherData = await fetchWeatherData(postData.zip);

        const projectData = {
            zip: postData.zip,
            prediction: postData.prediction,
            temperature: weatherData.main,
            weather: weatherData.weather
        };

        try{
            const url = "/api/projectData";

            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(projectData) 
            });
            
            await UpdateUI();
        }
        catch(error) {
            console.log("An error occurred while posting the data. Please retry again");
        }
    }
    else {
        console.log("Please check the values you have entered for Zip and Prediction. Something seems to be wrong!");
    }

}

// Execute when Generate button is clicked
function onGenerateButtonClickEvent() {
    const button = document.querySelector("#generate");
    button.addEventListener("click", function (e) { 
        e.preventDefault();
        postProjectData();
    });
  };
  
  onGenerateButtonClickEvent();
