// Base URL for API Calls
var BASE_URL = 'https://api.rootnet.in/covid19-in/stats';
// Get the span for last updated
var lastUpdated = $('.last-updated');
// Get the table body for appending rows
var tableBody = $('#state-wise-data');

// This function is called as soon as page is loaded
$(document).ready(function () {

    //This is the COVID alert part in Danger color
    $('.description').text('Coronavirus disease 2019 (COVID-19) is a contagious respiratory and vascular disease caused by severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2). First identified in Wuhan, China, it has caused an ongoing pandemic.Common symptoms include fever, cough, fatigue, breathing difficulties, and loss of smell and taste.Symptoms begin one to fourteen days after exposure to the virus.While most people have mild symptoms, some people develop acute respiratory distress syndrome (ARDS), which can be precipitated by cytokine storms,multi-organ failure, septic shock, and blood clots. Longer-term damage to organs (in particular, the lungs and heart) has been observed, and there is concern about a significant number of patients who have recovered from the acute phase of the disease but continue to experience a range of effects—known as long COVID—for months afterwards, including severe fatigue, memory loss and other cognitive issues, low grade fever, muscle weakness, and breathlessness.')

    //API calls starts from here
    fetch(`${BASE_URL}/latest`, {   //API call for latest Stats
        method: 'GET'   //Method used
    })
        .then(response => response.json())  //The response in converted to JSON
        .then(data => {
            lastUpdated.text(data.lastRefreshed);   //Append the last updated time
            var dataList = data.data.regional; //Create a list with all the state-wise data

            dataList.forEach(function (region, index) { //Traversing through the list of state
                var location = region.loc   //Location name
                var confirmedCasesIndian = region.confirmedCasesIndian  //Total Indian Cases
                var confirmedCasesForeign = region.confirmedCasesForeign    //Total Foreigner Cases
                var recovered = region.discharged   //Total recovered cases
                var deceased = region.deaths    //Total deceased cases
                var total = region.totalConfirmed   //Total confirmed Cases i.e. Indian + Foreigner
                var ratio = recovered / (confirmedCasesForeign + confirmedCasesIndian)  //Calculate a ratio so that later I can compare the danger,warning or safe cases

                //Check if recovery rate is more than 95% then it is safe
                if (ratio > 0.95) {
                    tableBody.append('<tr class="table-success"><td>' + (index + 1) + '</td><td>' + location + '</td><td>' + confirmedCasesIndian + '</td><td>' + confirmedCasesForeign + '</td><td>' + recovered + '</td><td>' + deceased + '</td><td>' + total + '</td></tr> ')
                }
                //Check if recovery rate is more than 90% but less than 95% then be causious
                else if (ratio < 0.95 && ratio > 0.90) {
                    tableBody.append('<tr class="table-warning"><td>' + (index + 1) + '</td><td>' + location + '</td><td>' + confirmedCasesIndian + '</td><td>' + confirmedCasesForeign + '</td><td>' + recovered + '</td><td>' + deceased + '</td><td>' + total + '</td></tr> ')
                }
                //Check if recovery rate is less than 90% then it is absolutely not safe
                else{
                    tableBody.append('<tr class="table-danger"><td>' + (index + 1) + '</td><td>' + location + '</td><td>' + confirmedCasesIndian + '</td><td>' + confirmedCasesForeign + '</td><td>' + recovered + '</td><td>' + deceased + '</td><td>' + total + '</td></tr> ')
                } 

            })

            console.log(dataList)
        })
        .catch(err => console.log(err));    //Error returned by the API
});