// Base URL for API Calls
var BASE_URL = 'https://api.rootnet.in/covid19-in/stats';
// Get the span for last updated for CHART-1
var lastUpdatedDist = $('.last-updated-1');
// Get the span for last updated for CHART-2 and CHART-3
var lastUpdatedLine = $('.last-updated-2');
// Get the card for COVID LIVE COUNT(CONFIRM)
var confirmInNumbers = $('.card-confirm');
// Get the card for COVID LIVE COUNT(RECOVERED)
var recoverInNumbers = $('.card-recover');
// Get the card for COVID LIVE COUNT(DEATHS)
var deathsInNumbers = $('.card-deaths');
// Get the dropdown for STATE Filtering
var dropdown = $('.dropdown-menu');
//Create an empty list for storing dates
var dates = [];
//Create an empty list for storing Confirmed Cases
var confirmed = [];
//Create an empty list for storing Recovered Cases
var recovered = [];
//Create an empty list for storing Deceased Cases
var deaths = [];

var state = 0;

//API calls starts from here
fetch(`${BASE_URL}/history`, {  //API call for fetching History Stats
  method: 'GET' //Method Used
})
  .then(response => {
    console.log(response)
    return (response.json())  //Convert response to json
  })
  .then(data => {

    //Update the last refreshed span
    lastUpdatedDist.text(data.lastRefreshed);

    //Store the Date-wise data in a list(it is fetched as a list from the API)
    var dataList = data.data;

    //Parse through the list to extract days,confirmed,discharges,deaths parameters
    //The total,discharged and deaths are cummulative state, hence below I had to subtract each data-point with their previous value, to get the exact specific date-wise value.
    for (var i = 1; i < dataList.length; i++) {
      dates.push(dataList[i].day) //Append the dates in the date list(created before)
      confirmed.push(dataList[i].summary.total - dataList[i - 1].summary.total) //Append the total cases in the confirmed list(created before)
      recovered.push(dataList[i].summary.discharged - dataList[i - 1].summary.discharged) //Append the recovered cases in the recovered list(created before)
      deaths.push(dataList[i].summary.deaths - dataList[i - 1].summary.deaths)  //Append the death cases in the deaths list(created before)
    }

    //Cards showing numeric values
    confirmInNumbers.text(dataList[dataList.length - 1].summary.total)
    recoverInNumbers.text(dataList[dataList.length - 1].summary.discharged)
    deathsInNumbers.text(dataList[dataList.length - 1].summary.deaths)

    //Chart-1 Area Chart showing date-wise Graph
    zingchart.render({
      id: 'myChart-1',
      data: {
        type: 'area',
        crosshairX: {},
        backgroundColor: 'transparent',
        legend: {
          align: 'right',
          borderWidth: 0,
          layout: '1',
          marker: {
            type: 'circle',
            borderWidth: 0
          }
        },
        scaleX: {
          item: {
            angle: -52,
            fontSize: 10
          },
          "tick": {
            "line-color": "none"
          },
          // set scale label
          label: {
            text: 'Days'
          },
          // convert text on scale indices
          labels: dates
        },
        scaleY: {
          visible: false,
          item: {
            visible: false
          },
          guide: {
            visible: false
          }
        },
        plot: {
          animation: {
            effect: 'ANIMATION_EXPAND_BOTTOM',
            method: 'ANIMATION_STRONG_EASE_OUT',
            speed: 200,
          }
        },
        series: [{
          // plot Confirmed, linear data
          values: confirmed,
          text: 'Confirmed',
          "background-color": "red",
          "line-color": "red"

        },
        {
          // plot Recovered, linear data
          values: recovered,
          text: 'Recovered',
          "background-color": "green",
          "line-color": "green"
        },
        {
          // plot Deaths, linear data
          values: deaths,
          text: 'Deaths',
          "background-color": "grey",
          "line-color": "grey"
        }
        ]
      }
    });
    console.log(data)

  })
  .catch(err => console.log(err));  //Errors after API Call

console.log(dates)
console.log(confirmed)
console.log(recovered)
console.log(deaths)

//Create an empty list for storing Confirmed State-wise Cases
var confirmed_statewise = [];
//Create an empty list for storing Recovered State-wise Cases
var recovered_statewise = [];
//Create an empty list for storing Deceased State-wise Cases
var deaths_statewise = [];
//Create an empty list for storing State Names
var loc = [];


//API calls starts from here
fetch(`${BASE_URL}/latest`, { //API call for fetching History Stats
  method: 'GET' //Method used
})
  .then(response => response.json())  //Convert data to JSON
  .then(data => {
    //Update the last refreshed span
    lastUpdatedLine.text(data.lastRefreshed);
    //Store the State-wise data in a list(it is fetched as a list from the API)
    var dataList = data.data.regional;

    //Parse through the list to extract dloc,confirmed,discharges,deaths parameters
    for (var i = 0; i < dataList.length; i++) {
      //Append state-names in the Drop-down with 'id' equal to their index number
      dropdown.append('<button class="dropdown-item" id=' + i + ' type="button">' + dataList[i].loc + '</button>')

      loc.push(dataList[i].loc) //Append the State Names in the loc list(created before)

      //Append the State-wise data in each respective List
      confirmed_statewise.push(dataList[i].totalConfirmed)
      recovered_statewise.push(dataList[i].discharged)
      deaths_statewise.push(dataList[i].deaths)
    }

    //Function for getting the clicked state Name
    $(document).on('click', '.dropdown-item', function (e) {
      console.log(e.target.id);

      //Set the selected State Name as Dropdown Value
      $('.dropdown-toggle').text(loc[e.target.id])

      state = e.target.id //store the clicked state name
      console.log(state)

      //Extract the specific state data
      var total_cases = dataList[state].totalConfirmed;
      var total_recovered = Math.round(((dataList[state].discharged / total_cases) * 100) * 100) / 100;
      var total_deaths = Math.round(((dataList[state].deaths / total_cases) * 100) * 100) / 100;

    //Chart-4-1 Speed-o-meter showing Recovery Rate Graph
      zingchart.render({
        id: 'myChart-4-1',
        data: {
          type: "gauge",
          globals: {
            fontSize: 16
          },
          plotarea: {
            marginTop: 40
          },
          plot: {
            size: '100%',
            valueBox: {
              placement: 'center',
              text: '%v', //default
              fontSize: 35,
              rules: [{
                rule: '%v > 70',
                text: '%v<br>EXCELLENT'
              },
              {
                rule: '%v <= 70 && %v > 40',
                text: '%v<br>Good'
              },
              {
                rule: '%v <= 40 && %v > 10',
                text: '%v<br>Fair'
              },
              {
                rule: '%v <= 10',
                text: '%v<br>Bad'
              }
              ]
            }
          },
          tooltip: {
            borderRadius: 5
          },
          scaleR: {
            aperture: 180,
            minValue: 0,
            maxValue: 100,
            center: {
              visible: false
            },
            tick: {
              visible: false
            },
            item: {
              offsetR: 0,
              rules: [{
                rule: '%i == 9',
                offsetX: 15
              }]
            },
            labels: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
            ring: {
              size: 50,
              rules: [{
                rule: '%v <10',
                backgroundColor: '#E53935'
              },
              {
                rule: '%v >=10 && %v < 40',
                backgroundColor: '#EF5350'
              },
              {
                rule: '%v >= 40 && %v < 70',
                backgroundColor: '#FFA726'
              },
              {
                rule: '%v >= 70',
                backgroundColor: '#29B6F6'
              }
              ]
            }
          },
          refresh: {
            type: "feed",
            transport: "js",
            url: "feed()",
            interval: 1500,
            resetTimeout: 1000
          },
          series: [{
            values: [total_recovered], // starting value
            backgroundColor: 'black',
            indicator: [10, 10, 10, 10, 0.75],
            animation: {
              effect: 2,
              method: 1,
              sequence: 4,
              speed: 900
            },
          }]
        }
      });

    //Chart-4-2 Speed-o-meter showing Death Rate Graph
      zingchart.render({
        id: 'myChart-4-2',
        data: {
          type: "gauge",
          globals: {
            fontSize: 16
          },
          plotarea: {
            marginTop: 40
          },
          plot: {
            size: '100%',
            valueBox: {
              placement: 'center',
              text: '%v', //default
              fontSize: 35,
              rules: [{
                rule: '%v <= 10',
                text: '%v<br>EXCELLENT'
              },
              {
                rule: '%v >= 10 && %v < 40',
                text: '%v<br>Good'
              },
              {
                rule: '%v >= 40 && %v < 70',
                text: '%v<br>Fair'
              },
              {
                rule: '%v >= 70',
                text: '%v<br>Bad'
              }
              ]
            }
          },
          tooltip: {
            borderRadius: 5
          },
          scaleR: {
            aperture: 180,
            minValue: 0,
            maxValue: 100,
            center: {
              visible: false
            },
            tick: {
              visible: false
            },
            item: {
              offsetR: 0,
              rules: [{
                rule: '%i == 9',
                offsetX: 15
              }]
            },
            labels: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
            ring: {
              size: 50,
              rules: [{
                rule: '%v >70',
                backgroundColor: '#E53935'
              },
              {
                rule: '%v <=70 && %v > 40',
                backgroundColor: '#EF5350'
              },
              {
                rule: '%v <= 40 && %v > 10',
                backgroundColor: '#FFA726'
              },
              {
                rule: '%v <= 10',
                backgroundColor: '#29B6F6'
              }
              ]
            }
          },
          refresh: {
            type: "feed",
            transport: "js",
            url: "feed()",
            interval: 1500,
            resetTimeout: 1000
          },
          series: [{
            values: [total_deaths], // starting value
            backgroundColor: 'black',
            indicator: [10, 10, 10, 10, 0.75],
            animation: {
              effect: 2,
              method: 1,
              sequence: 4,
              speed: 900
            },
          }]
        }
      });
    });

    //Chart-3 Donut-3D showing Recovery to Death Ratio Graph
    zingchart.render({
      id: 'myChart-3',
      globals: {
        fontSize: '14px'
      },
      data: {
        type: 'ring3d',
        legend: {
          align: 'right',
          borderWidth: 0,
          layout: 'x1',
          marker: {
            type: 'circle',
            borderWidth: 0
          }
        },
        plot: {
          animation: {
            effect: 'ANIMATION_EXPAND_BOTTOM',
            method: 'ANIMATION_STRONG_EASE_OUT',
            speed: 1000,
          }
        },
        series: [
          {
            // plot Recovered, linear data
            values: [data.data.summary.discharged],
            text: 'Recovered',
            "background-color": "#ffa600"
          },
          {
            // plot Deaths, linear data
            values: [data.data.summary.deaths],
            text: 'Deaths',
            "background-color": "#003f5c",
            detached: true
          }
        ]
      }
    });

    //Chart-2 Bar-3D showing State-wise Comparison Graph
    zingchart.render({
      id: 'myChart-2',
      data: {
        type: 'bar3d',
        crosshairX: {},
        backgroundColor: 'transparent',
        legend: {
          align: 'right',
          borderWidth: 0,
          layout: 'x1',
          marker: {
            type: 'circle',
            borderWidth: 0
          }
        },
        scaleX: {
          item: {
            angle: -90,
            fontSize: 10
          },
          maxItems: 36,
          "tick": {
            "line-color": "none"
          },
          // set scale label
          label: {
            text: 'States'
          },
          // convert text on scale indices
          labels: loc
        },
        scaleY: {
          visible: false,
        },
        plot: {
          animation: {
            effect: 'ANIMATION_EXPAND_BOTTOM',
            method: 'ANIMATION_STRONG_EASE_OUT',
            speed: 1000,
          }
        },
        series: [{
          // plot Confirmed, linear data
          values: confirmed_statewise,
          text: 'Confirmed',
          "background-color": "red"
        },
        {
          // plot Recovered, linear data
          values: recovered_statewise,
          text: 'Recovered',
          "background-color": "green"
        },
        {
          // plot Deaths, linear data
          values: deaths_statewise,
          text: 'Deaths',
          "background-color": "grey"
        }
        ]
      }
    });
    console.log(data)

  })
  .catch(err => console.log(err));  //Error after API Call

console.log(loc)
console.log(confirmed_statewise)
console.log(recovered_statewise)
console.log(deaths_statewise)
