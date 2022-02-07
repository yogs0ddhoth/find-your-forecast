//** application functionality:

//* search bar event handler:
$('form').on('click', 'button', function(event){
  handleSubmit();
  oneCall();
})

//* search function:
function handleSubmit() {
  let baseURL = "https://api.openweathermap.org/data/2.5/weather";
  let q = $('#search-input').val();
  let fetchURL = baseURL + "?q=" + q + "&units=imperial&appid=3228e13e94bfcef1510a65e94daa8d11";
  $.ajax({
    url: fetchURL,
    method: 'GET',
  }).then(function (response) {
    let cityCoord = response.coord;
    let cityCoordString = JSON.stringify(cityCoord);
    localStorage.setItem(q, cityCoordString);
  })
    // render button with city name 
}

function oneCall() {
  let q = $('#search-input').val();
  let cityCoord = JSON.parse(localStorage.getItem(q));
  let lat = cityCoord.lat;
  let lon = cityCoord.lon;
  let fetchURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=3228e13e94bfcef1510a65e94daa8d11"
  $.ajax({
    url: fetchURL,
    method: 'GET',
  }).then(function (response) {
    let cityCurrent = response.current;
    console.log(cityCurrent);
    let cityDaily = response.daily;
    console.log(cityDaily);
    let cityCurrentString = JSON.stringify(cityCurrent);
    let cityDailyString = JSON.stringify(cityDaily);
    let keyCurrent = q + '-Current';
    localStorage.setItem(keyCurrent, cityCurrentString);
    let keyDaily = q + '-Daily';
    localStorage.setItem(keyDaily, cityDailyString);
  })
}

//* function to handle API response
  // parse data into usable variables
  // save variables to local storage

//* funtion to render immediate data
  // render variables in html
  // render new aside button

//* aside button handler
$('').on('click', 'button', function(event){
  // re-declare locally stored data as variables
  // call render function with declared variables
})