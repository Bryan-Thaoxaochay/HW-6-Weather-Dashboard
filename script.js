// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history - ONLY NEED TO APPEND

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index - ONLY NEED INDEX

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe - ONLY NEED COLOR BOX

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast


$(".button").click(function(){

    var apiKey = "6b8354596eeef05a9add5fcdc34efb38";
    var city = $("#searchBox").val().trim();
    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;


    // Ajax Call: API for longitude and latitude
    $.ajax({
        url: weatherURL,
        method: "GET"
    }).done(function(weather){

        var latitude = weather.coord.lat;
        var longitude = weather.coord.lon;

        var onecallURL = "http://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey

        // Ajax Call: API for rest of weather info
        $.ajax({
            url: onecallURL,
            method: "GET"
        }).then(function(onecall){
        
        // Get temp, humidity, wind, UV index, and icon from object
        var tempK = onecall.current.temp;
        var tempF = Math.round((tempK*(9/5))-459.67)
        var humidity = onecall.current.humidity;
        var windSpeed = onecall.current.wind_speed;
        var UV = onecall.current.uvi;
        var icon = onecall.current.weather.id;

        console.log(icon);

        // Attaching weather variables to HTML
        var cityName = $("#city-name").append(city);
        $(date).append(icon);
        $("#temp").append($("<p>").html(tempF + " &#8457"));
        $("#humidity").append($("<p>").html(humidity + " %"));
        $("#wind-speed").append($("<p>").html(windSpeed + " mph"));

        var UVbold = $("<p>").html(UV);
        $("#uv-index").append(UVbold);

        // Getting and attaching date to HTML
        var date = new Date();

        var currentMonth = date.toLocaleString('default', { month: 'long' })
        var currentDay = date.getDate();
        var currentYear = date.getFullYear();

        var date = $(cityName).append(", " + currentMonth + " " + currentDay + ", " + currentYear);

        // Attaching icon


        
        // UV Index Indicator
        $(UVbold).attr("class", "card");
        $(UVbold).attr("style", "width: 1rem;");






        // Get 5-day forecast
        

        })
        

        // Append search history and the local storage
    })

})