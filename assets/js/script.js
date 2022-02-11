//** application functionality:

//* search bar event handler:
$('#search-form').on('click', 'button', function(event){
  event.preventDefault();
  console.log("testing");
  //* call api to get coordinates 
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
    // enter lat and lon as parameters for oneCall
    let onecallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=3228e13e94bfcef1510a65e94daa8d11";
    return onecallURL;
  }) // run oneCall api
  .then(function (onecallURL) {
    console.log(onecallURL);
    $.ajax({
      url: onecallURL,
      method: 'GET',
    }).then(function (response) {
      let cityCurrent = response.current;
      console.log(cityCurrent);
      
      //* render "current" on the jubotron:
      $('#hero-city').text(q);

      // extract weather icon and render
      let currentWeather = cityCurrent.weather;
      let currentWeatherIcon = 'http://openweathermap.org/img/wn/' + currentWeather[0].icon + '.png';
      // remove previous icon
      $('#icon').remove();
      // render current icon
      $('<img>', {
        'id': 'icon',
        'src': currentWeatherIcon,
      }).insertAfter($('#hero-city'));

      // extract date and render
      let currentDt = new Date(cityCurrent.dt*1000);
      let currentMonth = currentDt.getMonth();
      let currentDate = currentDt.getDate();
      let currentYear = currentDt.getFullYear();
      $('#hero-date').text(currentMonth + '/' + currentDate + '/' + currentYear);
      
      // render the rest of "current"
      $('#hero-temp').text(cityCurrent.temp + "\u00B0" + "F");
      $('#hero-wind_speed').text(cityCurrent.wind_speed + " MPH");
      $('#hero-humidity').text(cityCurrent.humidity + "%");
      
      // render uvi, and set background color according to safety
      let $uvi = $('#hero-uvi');
      $uvi.text(cityCurrent.uvi);
      if (cityCurrent.uvi <= 2.99) {
        $uvi.addClass('bg-success');
      } else if (cityCurrent.uvi <= 5.99) {
        $uvi.addClass('bg-warning');
      } else if (cityCurrent.uvi <= 7.99) {
        $uvi.addClass('bg-orange');
      } else if (cityCurrent.uvi <= 10.99) {
        $uvi.addClass('bg-danger');
      } else {
        $uvi.addClass('bg-purple');
      }
      
      let cityDaily = response.daily;
      console.log(cityDaily);
      // clear previous cards
      $('#5-day-forecast').empty();
      //* render "daily" into cards:
      for (i = 1; i <= 5; i++) {
        
        let $card = $('<div></div>', {
          'class': 'card col bg-dark-blue text-light shadow',
        }).appendTo($('#5-day-forecast'));
        
        // extract date and render
        let dailyDt = new Date(cityDaily[i].dt*1000);
        let dailyMonth = dailyDt.getMonth();
        let dailyDate = dailyDt.getDate();
        let dailyYear = dailyDt.getFullYear();
        $('<h4></h4>').text(dailyMonth + '/' + dailyDate + '/' + dailyYear)
        .appendTo($card);
        
        // extract weather icon and render
        let dailyWeather = cityDaily[i].weather;
        let dailyWeatherIcon = 'http://openweathermap.org/img/wn/' + dailyWeather[0].icon + '.png';
        $('<img>', {
          'id': 'icon',
          'src': dailyWeatherIcon,
        }).appendTo($card);
        
        // render the rest of the forecast
        $('<p></p>').text("Temp: " + cityDaily[i].temp.day + "\u00B0" + "F")
        .appendTo($card);
        $('<p></p>').text("Wind: " + cityDaily[i].wind_speed + " MPH")
        .appendTo($card);
        $('<p></p>').text("Humidity: " + cityDaily[i].humidity + "%")
        .appendTo($card);
      }

      // delete duplicate buttons
      $('#' + q).remove();
      // render button to call city again
      $('<button></button>', {
      'type': 'button',
      'id': q,
      'class': 'class="btn btn-secondary btn-lg btn-block',
      }).text(q).appendTo($('#saved'));
      // future code to impose a limit on the number buttons created and discards the oldest one when the limit is reached
      
      // clear search bar once code has run
      $('#search-input').val('')
    })
  })
})

//* aside button handler
$('#saved').on('click', 'button', function(event){
  event.preventDefault();
  // get coordinates from local storage
  let q = event.target.id;
  let cityCoord = JSON.parse(localStorage.getItem(q));
  let lat = cityCoord.lat;
  let lon = cityCoord.lon;
  let onecallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=3228e13e94bfcef1510a65e94daa8d11";
  // run oneCall api
  $.ajax({
    url: onecallURL,
    method: 'GET',
  }).then(function (response) {
    let cityCurrent = response.current;
    console.log(cityCurrent);

    //* render "current" on the jubotron:
    $('#hero-city').text(q);

    // extract weather icon and render
    let currentWeather = cityCurrent.weather;
    let currentWeatherIcon = 'http://openweathermap.org/img/wn/' + currentWeather[0].icon + '.png';
    
    // remove previous icon
    $('#icon').remove();
    // render current icon
    $('<img>', {
      'id': 'icon',
      'src': currentWeatherIcon,
    }).insertAfter($('#hero-city'));

    // extract date and render
    let currentDt = new Date(cityCurrent.dt*1000);
    let currentMonth = currentDt.getMonth();
    let currentDate = currentDt.getDate();
    let currentYear = currentDt.getFullYear();
    $('#hero-date').text(currentMonth + '/' + currentDate + '/' + currentYear);
    
    // render the rest of "current"
    $('#hero-temp').text(cityCurrent.temp + "\u00B0" + "F");
    $('#hero-wind_speed').text(cityCurrent.wind_speed + " MPH");
    $('#hero-humidity').text(cityCurrent.humidity + "%");
    
    // render uvi, and set background color according to safety
    let $uvi = $('#hero-uvi');
    $uvi.text(cityCurrent.uvi);
    if (cityCurrent.uvi <= 2.99) {
      $uvi.addClass('bg-success');
    } else if (cityCurrent.uvi <= 5.99) {
      $uvi.addClass('bg-warning');
    } else if (cityCurrent.uvi <= 7.99) {
      $uvi.addClass('bg-orange');
    } else if (cityCurrent.uvi <= 10.99) {
      $uvi.addClass('bg-danger');
    } else {
      $uvi.addClass('bg-purple');
    }
    
    let cityDaily = response.daily;
    console.log(cityDaily);
    // clear previous cards
    $('#5-day-forecast').empty();
    //* render "daily" into cards:
    for (i = 1; i <= 5; i++) {

      let $card = $('<div></div>', {
        'class': 'card col bg-dark-blue text-light shadow',
      }).appendTo($('#5-day-forecast'));
      
      // extract date and render
      let dailyDt = new Date(cityDaily[i].dt*1000);
      let dailyMonth = dailyDt.getMonth();
      let dailyDate = dailyDt.getDate();
      let dailyYear = dailyDt.getFullYear();
      $('<h4></h4>').text(dailyMonth + '/' + dailyDate + '/' + dailyYear)
      .appendTo($card);
      
      // exctract weather icon and render
      let dailyWeather = cityDaily[i].weather;
      let dailyWeatherIcon = 'http://openweathermap.org/img/wn/' + dailyWeather[0].icon + '.png';
      $('<img>', {
        'src': dailyWeatherIcon,
      }).appendTo($card);
      
      // render the rest of the forecast
      $('<p></p>').text("Temp: " + cityDaily[i].temp.day + "\u00B0" + "F")
      .appendTo($card);
      $('<p></p>').text("Wind: " + cityDaily[i].wind_speed + " MPH")
      .appendTo($card);
      $('<p></p>').text("Humidity: " + cityDaily[i].humidity + "%")
      .appendTo($card);
    }
  })
})
