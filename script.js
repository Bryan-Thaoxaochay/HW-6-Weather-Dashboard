// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast


$(".button").click(function(){

    var apiKey = "6b8354596eeef05a9add5fcdc34efb38";
    var city = $("#searchBox").val();
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
        
        // Get temp, humidity, wind, and UV index from object
        var tempK = onecall.current.temp;
        var humidity = onecall.current.humidity;
        var windSpeed = onecall.current.wind_speed;
        var UV = onecall.current.uvi;

        console.log(onecall);

        // Attaching weather variables to HTML
        var cityName = $("#city-name").append(city);
        $("#city-info").append($("<li>").html("<b> Temperature: </b>" + tempK + " &#8457"));
        $("#city-info").append($("<li>").html("<b> Humidity: </b>" + humidity + " %"));
        $("#city-info").append($("<li>").html("<b> Wind Speed: </b>" + windSpeed + " mph"));
        $("#city-info").append($("<li>").html("<b> UV Index: </b>" + UV));

        // Getting and attaching date to HTML
        var date = new Date();

        var currentMonth = date.toLocaleString('default', { month: 'long' })
        var currentDay = date.getDate();
        var currentYear = date.getFullYear();

        $(cityName).append(", " + currentMonth + " " + currentDay + ", " + currentYear);


        // Get 5-day forecast
        

        })
        

        // Append search history and the local storage
    })

})