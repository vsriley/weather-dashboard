$("#searchCity").on("click", function(event) {
    event.preventDefault();
    $(".cityTitle").empty();
    $(".fiveDayForecast").empty();
    var city = $("#cityInput").val();
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
        }


        //put title with city date and weather icon on the page
        title.text(city + " " + currentDate + " ");
        title.append(weatherIcon);
        $(".cityTitle").append(title);

        //get the temp and display on the page (temp already in F?)
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
                    UVBox.attr("style", "background-color: green; width: 60px; text-align: center");
                } else if (UV >= 3 && UV < 6){
                    //moderate UV
                    UVBox.attr("style", "background-color: yellow; width: 60px; text-align: center");
                } else if (UV >= 7 && UV < 8){
                    //high UV
                    UVBox.attr("style", "background-color: orange; width: 60px; text-align: center");
                } else if (UV >= 8 && UV < 11){
                    //very high UV
                    UVBox.attr("style", "background-color: red; width: 60px; text-align: center");
                } else if (UV >= 11){
                    //extreme UV
                    UVBox.attr("style", "background-color: purple; width: 60px; text-align: center");
                };
                UVBox.text(UV);
                var UVIndexText = "UV Index: ";
                var UVIndex = $('<p>');
                UVIndex.text(UVIndexText);
                UVIndex.append(UVBox);
                $(".cityTitle").append(UVIndex);
            });
        

    });
});