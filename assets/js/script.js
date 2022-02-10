//** application functionality:

//* search bar event handler:
$('#search-form').on('click', 'button', function(event){
  event.preventDefault();
  handleSubmit();
  // oneCall();
})

//* search function:
function handleSubmit() {
  console.log("testing");
  let baseURL = "https://api.openweathermap.org/data/2.5/weather";
  let q = $('#search-input').val();
  let fetchURL = baseURL + "?q=" + q + "&appid=3228e13e94bfcef1510a65e94daa8d11";
  $.ajax({
    url: fetchURL,
    method: 'GET',
  }).then(function (response) {
    console.log("testing1");
    let cityCoord = response.coord;
    console.log(cityCoord);
    // log lat and lon to local storage for later usage
    localStorage.setItem(q, JSON.stringify(cityCoord));
    let lat = cityCoord.lat;
    console.log(lat);
    let lon = cityCoord.lon;
    console.log(lon);
    let onecallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=3228e13e94bfcef1510a65e94daa8d11";
    return onecallURL;
  })
  .then(function (onecallURL) {
    console.log(onecallURL);
    $.ajax({
      url: onecallURL,
      method: 'GET',
    }).then(function (response) {
      let cityCurrent = response.current;
      console.log(cityCurrent);

      $('#pic').remove();
      
      // render "current" on the jubotron:
      
      $('#hero-city').text(q);

      /// extract weather icon and render
      let currentWeather = cityCurrent.weather;
      console.log(currentWeather);
      let currentWeatherIcon = 'http://openweathermap.org/img/wn/' + currentWeather[0].icon + '.png';
      $('#hero-city').after('<img id= "pic" src="' + currentWeatherIcon + '"></img>');
      
      /// extract date and render
      let currentDt = new Date(cityCurrent.dt*1000);
      let currentMonth = currentDt.getMonth();
      console.log(currentMonth);
      let currentDate = currentDt.getDate();
      console.log(currentDate);
      let currentYear = currentDt.getFullYear();
      console.log(currentYear);
      $('#hero-date').text(currentMonth + '/' + currentDate + '/' + currentYear);
      
      /// render the rest of "current"
      $('#hero-temp').text(cityCurrent.temp + "\u00B0" + "F");
      $('#hero-wind_speed').text(cityCurrent.wind_speed + " MPH");
      $('#hero-humidity').text(cityCurrent.humidity + "%");
      $('#hero-uvi').text(cityCurrent.uvi);
      // planned code to set background color for hero-uvi depending on safety
      // if (cityCurrent > ) {} else if (cityCurrent < ) {} else {}
      let cityDaily = response.daily;
      console.log(cityDaily);
      
      $('#5-day-forecast').empty();
      
      // render "daily" into cards
      for (i = 1; i <= 5; i++) {
        
        let $card = $('<div></div>', {
          'class': 'card col',
        }).appendTo($('#5-day-forecast'));
        
        let dailyDt = new Date(cityDaily[i].dt*1000);
        let dailyMonth = dailyDt.getMonth();
        console.log(dailyMonth);
        let dailyDate = dailyDt.getDate();
        console.log(dailyDate);
        let dailyYear = dailyDt.getFullYear();
        console.log(dailyYear);
        $('<h4></h4>').text(dailyMonth + '/' + dailyDate + '/' + dailyYear)
        .appendTo($card);
        
        let dailyWeather = cityDaily[i].weather;
        console.log(dailyWeather);
        let dailyWeatherIcon = 'http://openweathermap.org/img/wn/' + dailyWeather[0].icon + '.png';
        $('<img>', {
          'id': 'pic',
          'src': dailyWeatherIcon,
        }).appendTo($card);
        
        $('<p></p>').text("Temp: " + cityDaily[i].temp.day + "\u00B0" + "F")
        .appendTo($card);
        
        $('<p></p>').text("Wind: " + cityDaily[i].wind_speed + " MPH")
        .appendTo($card);
        
        $('<p></p>').text("Humidity: " + cityDaily[i].humidity + "%")
        .appendTo($card);
      }

      // render button to call city again
      /// future code to impose a limit on the number buttons created and discards the oldest one when the limit is reached
      $('#saved').append('<button type="button" id="' + q + '" class="btn btn-primary btn-lg btn-block">' + q + '</button>');
    })
  })
}

//* aside button handler
$('#saved').on('click', 'button', function(event){
  event.preventDefault();
  let q = event.target.id;
  let cityCoord = JSON.parse(localStorage.getItem(q));
  let lat = cityCoord.lat;
  let lon = cityCoord.lon;
  let onecallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=3228e13e94bfcef1510a65e94daa8d11";
  $.ajax({
    url: onecallURL,
    method: 'GET',
  }).then(function (response) {
    let cityCurrent = response.current;
    console.log(cityCurrent);

    $('#pic').remove();
    
    // render "current" on the jubotron:
    
    $('#hero-city').text(q);

    /// extract weather icon and render
    let currentWeather = cityCurrent.weather;
    console.log(currentWeather);
    let currentWeatherIcon = 'http://openweathermap.org/img/wn/' + currentWeather[0].icon + '.png';
    $('#hero-city').after('<img id="pic" src="' + currentWeatherIcon + '"></img>');
    
    /// extract date and render
    let currentDt = new Date(cityCurrent.dt*1000);
    let currentMonth = currentDt.getMonth();
    console.log(currentMonth);
    let currentDate = currentDt.getDate();
    console.log(currentDate);
    let currentYear = currentDt.getFullYear();
    console.log(currentYear);
    $('#hero-date').text(currentMonth + '/' + currentDate + '/' + currentYear);
    
    /// render the rest of "current"
    $('#hero-temp').text(cityCurrent.temp + "\u00B0" + "F");
    $('#hero-wind_speed').text(cityCurrent.wind_speed + " MPH");
    $('#hero-humidity').text(cityCurrent.humidity + "%");
    $('#hero-uvi').text(cityCurrent.uvi);
    // planned code to set background color for hero-uvi depending on safety
    // if (cityCurrent > ) {} else if (cityCurrent < ) {} else {}
    let cityDaily = response.daily;
    console.log(cityDaily);
    
    $('#5-day-forecast').empty();

    // render "daily" into cards
    for (i = 1; i <= 5; i++) {

      let $card = $('<div></div>', {
        'class': 'card col',
      }).appendTo($('#5-day-forecast'));
      
      let dailyDt = new Date(cityDaily[i].dt*1000);
      let dailyMonth = dailyDt.getMonth();
      console.log(dailyMonth);
      let dailyDate = dailyDt.getDate();
      console.log(dailyDate);
      let dailyYear = dailyDt.getFullYear();
      console.log(dailyYear);
      $('<h4></h4>').text(dailyMonth + '/' + dailyDate + '/' + dailyYear)
      .appendTo($card);
      
      let dailyWeather = cityDaily[i].weather;
      console.log(dailyWeather);
      let dailyWeatherIcon = 'http://openweathermap.org/img/wn/' + dailyWeather[0].icon + '.png';
      $('<img>', {
        'src': dailyWeatherIcon,
      }).appendTo($card);
      
      $('<p></p>').text("Temp: " + cityDaily[i].temp.day + "\u00B0" + "F")
      .appendTo($card);
      
      $('<p></p>').text("Wind: " + cityDaily[i].wind_speed + " MPH")
      .appendTo($card);
      
      $('<p></p>').text("Humidity: " + cityDaily[i].humidity + "%")
      .appendTo($card);
    }
  })
})

// $("#search-form").submit(function(event) {
//   event.preventDefault();
// });