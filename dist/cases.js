// import {country_list} from  './countries'


// function cases(){
const country_name_element = document.querySelector(".country .name");
const total_cases_element = document.querySelector(".total-cases .value");
const new_cases_element = document.querySelector(".total-cases .new-value");
const recovered_element = document.querySelector(".recovered .value");
const new_recovered_element = document.querySelector(".recovered .new-value");
const deaths_element = document.querySelector(".deaths .value");
const new_deaths_element = document.querySelector(".deaths .new-value");

const ctx = document.getElementById("axes_line_chart").getContext("2d");

// APP VARIABLES
let app_data = [],
  cases_list = [],
  recovered_list = [],
  deaths_list = [],
  new_cases_list = [],
  new_recovered_list = [],
  new_deaths_list = [],
  dates = [],

  formatedDates = [];


// GET USERS COUNTRY CODE
// let country_code = geoplugin_countryCode();
// console.log(country_code)
// let user_country;

// let country_code = "US";
let country_code = "Global";
let country_name;
// let country_name;


/* ---------------------------------------------- */
/*                     FETCH API                  */
/* ---------------------------------------------- */

function fetchData(country) {
  let user_country = country;
  country_name_element.innerHTML = "Loading...";
  let url = `https://corona-api.com/countries/${user_country}`;

if(user_country ==="Global"){
  url = "https://corona-api.com/timeline"
  country_name = "Global"
  
}else{  
  
  country_list.forEach((country) => {
    if (country.code === user_country) {  
      country_name = country.name;
    }
  });
}

  (cases_list = []),
  (recovered_list = []),
  (deaths_list = []),
  (dates = []),
  (new_cases_list = []),
  (new_recovered_list = []),
  (new_deaths_list = []),
  (formatedDates = []);

  
  fetch(url)
  .then(response => {

    return response.json();
  })
  .then(resJson =>{

    // dates = Object.keys(data);

    if(user_country ==="Global"){
      app_data = resJson.data;
    }else{

      app_data = resJson.data.timeline;
    }

    app_data.forEach(data => {


      dates.push(data.date)
      // let DATA = data.date;
      cases_list.push(data.confirmed)
      recovered_list.push(data.recovered)
      deaths_list.push(data.deaths)

      new_cases_list.push(data.new_confirmed)


      new_recovered_list.push(data.new_recovered)
      new_deaths_list.push(data.new_deaths)
 
    })
  }).then(()=>{
    updateUI()
  })
  .catch(error=>{
    alert(error)
  })
}

fetchData(country_code)

function updateUI() {
  updateStats();
  axesLinearChart();
}

function updateStats() {


  country_name_element.innerHTML = country_name;
  total_cases_element.innerHTML = cases_list[0].toLocaleString();

  new_cases_element.innerHTML = `+${new_cases_list[0].toLocaleString()}`;
  recovered_element.innerHTML = recovered_list[0].toLocaleString();

  new_recovered_element.innerHTML = `+${new_recovered_list[0].toLocaleString()}`;
  deaths_element.innerHTML = deaths_list[0].toLocaleString();
  new_deaths_element.innerHTML = `+${new_deaths_list[0].toLocaleString()}`;

}




// UPDATE CHART
let my_chart;
function axesLinearChart() {
  if (my_chart) {
    my_chart.destroy();
  }

  my_chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Cases",
          data: cases_list,
          fill: false,
          borderColor: "#FFF",
          // backgroundColor: "#FFF",
          borderWidth: 1,
        },
        {
          label: "Recovered",
          data: recovered_list,
          fill: false,
          borderColor: "#009688",
          // backgroundColor: "#009688",
          borderWidth: 1,
        },
        {
          label: "Deaths",
          data: deaths_list,
          fill: false,
          borderColor: "#f44336",
          // backgroundColor: "#f44336",
          borderWidth: 1,
        },
      ],
      labels: dates,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    //   plugins: {
    //     title: {
    //         display: true,
    //         text: 'Cases Timeline',
    //         weight: 'bold',
    //         font:{
    //           size: 21,
    //         }
    //     },     
      
    // },

      scales: {
        yAxes: [{
             gridLines: {
                display: false,
            }
        }]
   },


    },

  });
}

