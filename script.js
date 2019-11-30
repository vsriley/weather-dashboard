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


        title.text(city + " " + currentDate + " ");
        title.append(weatherIcon);
        $(".cityTitle").append(title);

        


    });
});