/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

// Update the UI with project data
async function UpdateUI() {
    try {
        // clear entered data
        document.querySelector("#txt-zipCode").value = "";
        document.querySelector("#txtarea-prediction").value = "";

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
    temperature.innerHTML = `<span><strong>Min Temp: </strong>${data.temperature.temp_min} K, <strong>Max Temp: </strong>${data.temperature.temp_max} K</span>`;

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
  

// Post project data
async function postProjectData() {

    const postData = {
        zip: document.querySelector("#txt-zipCode").value,
        prediction: document.querySelector("#txtarea-prediction").value
    };

    if(postData.zip && postData.prediction){
        try{
            const url = "/api/projectData";

            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(postData) 
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
function onGenerateButtonClick(e) {
    e.preventDefault();
    setTimeout(postProjectData,0);
}