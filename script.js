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
        console.log("currentDate: " + currentDate);
        title.text(city + " " + currentDate);
        $(".cityTitle").append(title);


    });
});