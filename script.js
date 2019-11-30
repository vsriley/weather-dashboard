

$("#searchCity").on("click", function(event) {
    event.preventDefault();
    var city = $("#cityInput").val().trim(); 
    var cities = JSON.parse(localStorage.getItem("savedCities"));
    console.log("Cities: " + cities);
    if (cities != null) {
        //prevent duplicates from being added to the array
        for (var i = 0; i < cities.length; i++){
            if (cities.indexOf(city) === -1) {
                cities.push(city);  
            }
        }
    } else {
        cities = [city];
    }
    localStorage.setItem("savedCities", JSON.stringify(cities));
    displayCityInfo(city);
    renderButtons();
    
});

$(document).on("click", ".city", function(event){
    var city = $(this).attr("data-name");
    displayCityInfo(city);
});

function displayCityInfo(city) {
    $(".cityTitle").empty();
    $(".fiveDayForecast").empty();
    $(".fiveDayForecastTitle").empty();
    $("#cityInput").val("");
    
    console.log("City: " + city);
    var APIKey = "7c21203677410678d82df2cad2879047";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    
    // AJAX call to the OpenWeatherMap API
    $.ajax({
    url: queryURL,
    method: "GET"
    })
    .then(function(response) {
    
        console.log(queryURL);
        console.log(response);
    
        var title = $('<h1>');
        var currentDate = moment().format('L');
        var weatherIcon = $('<i>');
    
        console.log("currentDate: " + currentDate);
    
        //get correct weather icon
        if(response.weather[0].main === "Clouds"){
            weatherIcon.attr("class", "fas fa-cloud");
        } else if (response.weather[0].main === "Rain"){
            weatherIcon.attr("class", "fas fa-cloud-showers-heavy");
        } else if (response.weather[0].main === "Thunderstorm"){
            weatherIcon.attr("class", "fas fa-bolt");
        } else if (response.weather[0].main === "Drizzle"){
            weatherIcon.attr("class", "fas fa-cloud-rain");
        } else if (response.weather[0].main === "Snow"){
            weatherIcon.attr("class", "fas fa-snowflake");
        } else if (response.weather[0].main === "Mist" || response.weather[0].main === "Smoke" || response.weather[0].main === "Haze" || response.weather[0].main === "Dust" || response.weather[0].main === "Fog" || response.weather[0].main === "Sand" || response.weather[0].main === "Ash"){
            weatherIcon.attr("class", "fas fa-smog");
        } else if (response.weather[0].main === "Squall" || response.weather[0].main === "Tornado"){
            weatherIcon.attr("class", "fas fa-wind");
        } else if (response.weather[0].main === "Clear"){
            weatherIcon.attr("class", "fas fa-sun");
        };
    
    
        //put title with city date and weather icon on the page
        title.text(city + " " + currentDate + " ");
        title.append(weatherIcon);
        $(".cityTitle").append(title);
        city = city.replace(/\s/g,'+'); 
        console.log("New City String: " + city);
    
        //get the temp and display on the page (temp already in F)
        var temperatureInFahrenheit = (response.main.temp).toFixed(2);
        console.log("Temp in F: " + temperatureInFahrenheit);
        var temperature = $('<p>');
        temperature.text("Temperature: " + temperatureInFahrenheit + "°F");
        $(".cityTitle").append(temperature);
        
        //get the humidity and display on the page
        var currentHumidity = response.main.humidity;
        console.log("Humidity: " + currentHumidity);
        var humidity = $('<p>');
        humidity.text("Humidity: " + currentHumidity + "%");
        $(".cityTitle").append(humidity);
    
        //get the windspeed and display on the page
        var windSpeed = response.wind.speed;
        console.log("Wind Speed: " + windSpeed);
        var wind = $('<p>');
        wind.text("Wind Speed: " + windSpeed + " MPH");
        $(".cityTitle").append(wind);
    
        //get the UV Index and display on the page
        var UVURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + response.coord.lat + "&lon=" + response.coord.lon;
        $.ajax({
            url: UVURL,
            method: "GET"
            })
            .then(function(response) {
                console.log("UV: " + response.value);
                var UV = response.value;
                var UVBox = $("<span>");
                if (UV < 3){
                    //low UV
                    UVBox.attr("style", "background-color: green; padding: 5px; text-align: center; color: white");
                } else if (UV >= 3 && UV < 6){
                    //moderate UV
                    UVBox.attr("style", "background-color: yellow; padding: 5px; text-align: center");
                } else if (UV >= 7 && UV < 8){
                    //high UV
                    UVBox.attr("style", "background-color: orange; padding: 5px; text-align: center");
                } else if (UV >= 8 && UV < 11){
                    //very high UV
                    UVBox.attr("style", "background-color: red; padding: 5px; text-align: center; color: white");
                } else if (UV >= 11){
                    //extreme UV
                    UVBox.attr("style", "background-color: purple; padding: 5px; text-align: center; color: white");
                };
                UVBox.text(UV);
                var UVIndexText = "UV Index: ";
                var UVIndex = $('<p>');
                UVIndex.text(UVIndexText);
                UVIndex.append(UVBox);
                $(".cityTitle").append(UVIndex);
            });
            
            var fiveDayForecastURL = "https://api.openweathermap.org/data/2.5/find?q=" + city + "&units=imperial&appid=" + APIKey;
            
            // AJAX call to the OpenWeatherMap API for five day forecast
            $.ajax({
                url: fiveDayForecastURL,
                method: "GET"
            })
            .then(function(response) {
                console.log(JSON.stringify(response));
                var forecastTitle =  $('<h2>');
                forecastTitle.text("5-Day Forecast: ");
                $(".fiveDayForecastTitle").append(forecastTitle);
                //create five day forecast
                //include date at the top; icon of the weather, temp, and humidity
                for(var i = 0; i < 5; i++){
                    var forecast = $('<div>');
                    forecast.attr("style", "background-color: #0066ff; color: white; font-size: 14px; margin-right: 10px; margin-left: 10px; margin-bottom: 10px");
                    forecast.attr("class", "col-md-2 col-sm-6");
                    
                    //adding date to the top of the forecast
                    var nextDate = $('<h6>');
                    nextDate.text(moment().add(i + 1, 'days').format('L')); 
                    forecast.append(nextDate);
                    
                    console.log(response.list[i].weather[0].main);
                    console.log(response.list[i].main.temp);
                    console.log(response.list[i].main.humidity);
                    
                    var nextWeatherIcon = $('<i>');
                    //get correct weather icon
                    if(response.list[i].weather[0].main === "Clouds"){
                        nextWeatherIcon.attr("class", "fas fa-cloud");
                    } else if (response.list[i].weather[0].main === "Rain"){
                        nextWeatherIcon.attr("class", "fas fa-cloud-showers-heavy");
                    } else if (response.list[i].weather[0].main === "Thunderstorm"){
                        nextWeatherIcon.attr("class", "fas fa-bolt");
                    } else if (response.list[i].weather[0].main === "Drizzle"){
                        nextWeatherIcon.attr("class", "fas fa-cloud-rain");
                    } else if (response.list[i].weather[0].main === "Snow"){
                        nextWeatherIcon.attr("class", "fas fa-snowflake");
                    } else if (response.list[i].weather[0].main === "Mist" || response.list[i].weather[0].main === "Smoke" || response.list[i].weather[0].main === "Haze" || response.list[i].weather[0].main === "Dust" || response.list[i].weather[0].main === "Fog" || response.list[i].weather[0].main === "Sand" || response.list[i].weather[0].main === "Ash"){
                        nextWeatherIcon.attr("class", "fas fa-smog");
                    } else if (response.list[i].weather[0].main === "Squall" || response.list[i].weather[0].main === "Tornado"){
                        nextWeatherIcon.attr("class", "fas fa-wind");
                    } else if (response.list[i].weather[0].main === "Clear"){
                        nextWeatherIcon.attr("class", "fas fa-sun");
                    };
                    forecast.append(nextWeatherIcon);
                    
                    //temperature
                    var nextTemp = $('<p>');
                    nextTemp.text("Temperature: " + response.list[i].main.temp + "°F");
                    forecast.append(nextTemp);
                    
                    //humidity
                    var nextHumidity = $('<p>');
                    nextHumidity.text("Humidity: " + response.list[i].main.humidity + "%");
                    forecast.append(nextHumidity);
                    
                    //put all the information onto the page
                    $(".fiveDayForecast").append(forecast);
                }
            });
    });

};

renderButtons();

// Function for creating new search buttons
function renderButtons() {
    cities = JSON.parse(localStorage.getItem("savedCities"));
    if (cities === null || cities === undefined){
        return;
    }
    // Deleting the buttons prior to adding new cities
    $("#previousSearch").empty();
        // Looping through the array of cities
        console.log("Cities: " + cities);
        for (var i = 0; i < cities.length; i++) {

          // Then dynamicaly generating buttons for each city in the array
          var a = $("<button>");
          // Adding a class of movie to our button
          a.addClass("city btn btn-outline-secondary btn-block");
          // Adding a data-attribute
          a.attr("data-name", cities[i]);
          // Providing the initial button text
          a.text(cities[i]);
          // Adding the button to the buttons-view div
          $("#previousSearch").append(a);
        }
      }