// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history - DONE

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index - ONLY NEED ICON

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe - DONE

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity - NEED DATE AND ICON

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
        
        
        // Emptying weather values from previous city
        $("#city-name").empty();
        $("#temp").empty();
        $("#humidity").empty();
        $("#wind-speed").empty();
        $("#uv-index").empty();
        
        // Attaching weather variables to HTML
        var cityName = $("#city-name").append(city);
        $(date).append(icon);
        $("#temp").append($("<p>").html("Temperature: " + tempF + " &#8457"));
        $("#humidity").append($("<p>").html("Humidity: " + humidity + " %"));
        $("#wind-speed").append($("<p>").html("Wind Speed: " + windSpeed + " mph"));

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
        $(UVbold).attr("class", "card bg-primary mb-3");
        $(UVbold).attr("style", "width: 1rem;");

        // Low 0-2 (black): Moderate 3-5 (gray): High 6-7 (green): Very High: 8-10 (yellow): Extreme 11+ (red)
        if (UV <= 2) {
            $(UVbold).attr("class", "card text-white bg-dark mb-3");
        }
        else if (UV >=3 && UV <=5){
            $(UVbold).attr("class", "card text-white bg-secondary mb-3");
        }
        else if (UV >=6 && UV <=7){
            $(UVbold).attr("class", "card text-white bg-success mb-3");
        }
        else if (UV >=8 && UV <=10){
            $(UVbold).attr("class", "card text-white bg-warning mb-3");
        }
        else {
            $(UVbold).attr("class", "card text-white bg-danger mb-3");
        }
        // Creates multiple rows for double digit numbers
        






        // Get 5-day forecast: date, icon, temp, and humidity

        $("#five-day").empty(); // Removes previous cities forecast

        for (var i = 0; i < onecall.daily.length; i++){

            var figure = $("<figure>");
            $("#five-day").append(figure);
            $(figure).attr("class", "card text-white bg-primary");
            $(figure).attr("style", "width: 8rem;");

            var dailyIcon = $("<p>").html(onecall.daily[i].weather.icon);
            var dailyTempK = onecall.daily[i].temp.day;
            var dailyTempF = $("<p>").html("Temp: " + (Math.round((dailyTempK*(9/5))-459.67) + 
            " &#8457"));
            var dailyHumidity = $("<p>").html("Humidity: " + onecall.daily[i].humidity + "%");

            $(figure).append(dailyIcon);
            $(figure).append(dailyTempF);
            $(figure).append(dailyHumidity);

        }


        })
        

        // Append search history and the local storage
        var storingCity = $("#searchBox").val();
        localStorage.setItem("storingCity", storingCity);

        for (var i = 0; i < localStorage.length; i++){
        var storedCity = localStorage.getItem("storingCity");
        var cityTR = $("<button>");
        var cityText = cityTR.html(storedCity);
        $("#nav").append(cityText);
        }
    })

})