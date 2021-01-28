// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history - DONE

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index - DONE

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe - DONE

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity - DONE

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city - NEED TO SELECT ONLY ONE CHILD

// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast - DONE

$(".button").click(function weatherUpload() {

    var city = $("#searchBox").val().trim();
    var capitalCity = city.charAt(0).toUpperCase() + city.slice(1);
    var weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6b8354596eeef05a9add5fcdc34efb38";


        // Ajax Call: API for longitude and latitude
        $.ajax({
            url: weatherURL,
            method: "GET"
        }).done(function (weather) {

            

            var latitude = weather.coord.lat;
            var longitude = weather.coord.lon;

            var onecallURL = "http://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=6b8354596eeef05a9add5fcdc34efb38";



            // Ajax Call: API for rest of weather info
            $.ajax({
                url: onecallURL,
                method: "GET"
            }).then(function (onecall) {


                // Get temp, humidity, wind, UV index, and icon from object
                var tempK = onecall.current.temp;
                var tempF = Math.round((tempK * (9 / 5)) - 459.67)
                var humidity = onecall.current.humidity;
                var windSpeed = onecall.current.wind_speed;
                var UV = onecall.current.uvi;
                var icon = onecall.current.weather[0].icon;
                
                
                    // Emptying weather values from previous city
                    $("#city-name").empty();
                    $("#temp").empty();
                    $("#humidity").empty();
                    $("#wind-speed").empty();
                    $("#uv-index").empty();

                    // Attaching weather variables to HTML
                    var cityName = $("#city-name").append(capitalCity);
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
                    var iconEl = $("<img>");
                    var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                    var cityIcon = $(iconEl).attr("src", iconURL);
                    $(date).append(cityIcon);




                    // UV Index Indicator
                    $(UVbold).attr("class", "bg-primary mb-3");
                    $(UVbold).attr("style", "width: 1rem;");

                    // Low 0-2 (black): Moderate 3-5 (gray): High 6-7 (green): Very High: 8-10 (yellow): Extreme 11+ (red)
                    if (UV <= 2) {
                        $(UVbold).attr("class", "card text-white bg-dark mb-3");
                    }
                    else if (UV >= 3 && UV <= 5) {
                        $(UVbold).attr("class", "card text-white bg-secondary mb-3");
                    }
                    else if (UV >= 6 && UV <= 7) {
                        $(UVbold).attr("class", "card text-white bg-success mb-3");
                    }
                    else if (UV >= 8 && UV <= 10) {
                        $(UVbold).attr("class", "card text-white bg-warning mb-3");
                    }
                    else {
                        $(UVbold).attr("class", "card text-white bg-danger mb-3");
                    }
                    // Creates multiple rows for double digit numbers



                    // Get 5-day forecast: date, icon, temp, and humidity

                    $("#five-day").empty(); // Removes previous cities forecast

                    $("#five-day").html("<h4> 5-Day Forecast");

                    for (var i = 0; i < onecall.daily.length; i++) {

                        if (i > 4){
                            break;
                        }

                        var figure = $("<figure>");
                        $("#five-day").append(figure);
                        $(figure).attr("class", "card text-white bg-primary");
                        $(figure).attr("style", "width: 8rem;");

                        
                        var dailyDate = moment(onecall.daily[i].dt * 1000).format("MM / DD / YY");
                        var dailyIcon = onecall.daily[i].weather[0].icon;
                        var dailyTempK = onecall.daily[i].temp.day;
                        var dailyTempF = $("<p>").html("Temp: " + (Math.round((dailyTempK * (9 / 5)) - 459.67) +
                            " &#8457"));
                        var dailyHumidity = $("<p>").html("Humidity: " + onecall.daily[i].humidity + "%");

                        var futureiconEl = $("<img>");
                        var futureiconURL = "http://openweathermap.org/img/wn/" + dailyIcon + "@2x.png";
                        var futurecityIcon = $(futureiconEl).attr("src", futureiconURL);

                        $(figure).append(dailyDate);
                        $(figure).append(futurecityIcon);
                        $(figure).append(dailyTempF);
                        $(figure).append(dailyHumidity);

                    }

                    // Append search history and the local storage
                    var storingCity = $("#searchBox").val().trim().charAt(0).toUpperCase() +  $("#searchBox").val().slice(1);
                    localStorage.setItem("storingCity", storingCity);

                    for (var i = 0; i < localStorage.length; i++) {
                        var storedCity = localStorage.getItem("storingCity");
                        var cityButton = $("<button>").attr("class", "searchHistory");
                        var cityText = cityButton.html(storedCity);
                        $("#nav").append(cityText);
                    }

            }) // Second Ajax Call
        }) // First Ajax Call        
}) // Button Function



// Using search history to navigate weather info
$("#nav").click(function () {

    var searchHistory = $(this).children(".searchHistory").text();
    console.log(searchHistory);

    var navURL = "http://api.openweathermap.org/data/2.5/weather?q=" + searchHistory + "&appid=6b8354596eeef05a9add5fcdc34efb38";

    // Ajax Call: API for longitude and latitude
    $.ajax({
        url: navURL,
        method: "GET"
    }).done(function (weather) {

        

        var latitude = weather.coord.lat;
        var longitude = weather.coord.lon;

        var onecallURL = "http://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=6b8354596eeef05a9add5fcdc34efb38";



        // Ajax Call: API for rest of weather info
        $.ajax({
            url: onecallURL,
            method: "GET"
        }).then(function (onecall) {


            // Get temp, humidity, wind, UV index, and icon from object
            var tempK = onecall.current.temp;
            var tempF = Math.round((tempK * (9 / 5)) - 459.67)
            var humidity = onecall.current.humidity;
            var windSpeed = onecall.current.wind_speed;
            var UV = onecall.current.uvi;
            var icon = onecall.current.weather[0].icon;
            
            
                // Emptying weather values from previous city
                $("#city-name").empty();
                $("#temp").empty();
                $("#humidity").empty();
                $("#wind-speed").empty();
                $("#uv-index").empty();

                // Attaching weather variables to HTML
                var cityName = $("#city-name").append(searchHistory);
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
                var iconEl = $("<img>");
                var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                var cityIcon = $(iconEl).attr("src", iconURL);
                $(date).append(cityIcon);




                // UV Index Indicator
                $(UVbold).attr("class", "bg-primary mb-3");
                $(UVbold).attr("style", "width: 1rem;");

                // Low 0-2 (black): Moderate 3-5 (gray): High 6-7 (green): Very High: 8-10 (yellow): Extreme 11+ (red)
                if (UV <= 2) {
                    $(UVbold).attr("class", "card text-white bg-dark mb-3");
                }
                else if (UV >= 3 && UV <= 5) {
                    $(UVbold).attr("class", "card text-white bg-secondary mb-3");
                }
                else if (UV >= 6 && UV <= 7) {
                    $(UVbold).attr("class", "card text-white bg-success mb-3");
                }
                else if (UV >= 8 && UV <= 10) {
                    $(UVbold).attr("class", "card text-white bg-warning mb-3");
                }
                else {
                    $(UVbold).attr("class", "card text-white bg-danger mb-3");
                }
                // Creates multiple rows for double digit numbers



                // Get 5-day forecast: date, icon, temp, and humidity

                $("#five-day").empty(); // Removes previous cities forecast

                $("#five-day").html("<h4> 5-Day Forecast");

                for (var i = 0; i < onecall.daily.length; i++) {

                    if (i > 4){
                        break;
                    }

                    var figure = $("<figure>");
                    $("#five-day").append(figure);
                    $(figure).attr("class", "card text-white bg-primary");
                    $(figure).attr("style", "width: 8rem;");

                    
                    var dailyDate = moment(onecall.daily[i].dt * 1000).format("MM / DD / YY");
                    var dailyIcon = onecall.daily[i].weather[0].icon;
                    var dailyTempK = onecall.daily[i].temp.day;
                    var dailyTempF = $("<p>").html("Temp: " + (Math.round((dailyTempK * (9 / 5)) - 459.67) +
                        " &#8457"));
                    var dailyHumidity = $("<p>").html("Humidity: " + onecall.daily[i].humidity + "%");

                    var futureiconEl = $("<img>");
                    var futureiconURL = "http://openweathermap.org/img/wn/" + dailyIcon + "@2x.png";
                    var futurecityIcon = $(futureiconEl).attr("src", futureiconURL);

                    $(figure).append(dailyDate);
                    $(figure).append(futurecityIcon);
                    $(figure).append(dailyTempF);
                    $(figure).append(dailyHumidity);

                }

        }) // Second Ajax Call
    }) // First Ajax Call        
}) // #nav Button Function


// Loading last searched city and it's weather info when page is loaded
function loadLocalStorage() {

    for (var i = 0; i < localStorage.length; i++) {
        var storedCity = localStorage.getItem("storingCity");
        var cityButton = $("<button>").attr("class", "searchHistory");
        var cityText = cityButton.html(storedCity);
        $("#nav").append(cityText);
    }

    var lastCity = localStorage.getItem("storingCity");
    console.log(lastCity);

    var navURL = "http://api.openweathermap.org/data/2.5/weather?q=" + lastCity + "&appid=6b8354596eeef05a9add5fcdc34efb38";

    // Ajax Call: API for longitude and latitude
    $.ajax({
        url: navURL,
        method: "GET"
    }).done(function (weather) {

        

        var latitude = weather.coord.lat;
        var longitude = weather.coord.lon;

        var onecallURL = "http://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=6b8354596eeef05a9add5fcdc34efb38";



        // Ajax Call: API for rest of weather info
        $.ajax({
            url: onecallURL,
            method: "GET"
        }).then(function (onecall) {


            // Get temp, humidity, wind, UV index, and icon from object
            var tempK = onecall.current.temp;
            var tempF = Math.round((tempK * (9 / 5)) - 459.67)
            var humidity = onecall.current.humidity;
            var windSpeed = onecall.current.wind_speed;
            var UV = onecall.current.uvi;
            var icon = onecall.current.weather[0].icon;
            
            
                // Emptying weather values from previous city
                $("#city-name").empty();
                $("#temp").empty();
                $("#humidity").empty();
                $("#wind-speed").empty();
                $("#uv-index").empty();

                // Attaching weather variables to HTML
                var cityName = $("#city-name").append(lastCity);
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
                var iconEl = $("<img>");
                var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                var cityIcon = $(iconEl).attr("src", iconURL);
                $(date).append(cityIcon);




                // UV Index Indicator
                $(UVbold).attr("class", "bg-primary mb-3");
                $(UVbold).attr("style", "width: 1rem;");

                // Low 0-2 (black): Moderate 3-5 (gray): High 6-7 (green): Very High: 8-10 (yellow): Extreme 11+ (red)
                if (UV <= 2) {
                    $(UVbold).attr("class", "card text-white bg-dark mb-3");
                }
                else if (UV >= 3 && UV <= 5) {
                    $(UVbold).attr("class", "card text-white bg-secondary mb-3");
                }
                else if (UV >= 6 && UV <= 7) {
                    $(UVbold).attr("class", "card text-white bg-success mb-3");
                }
                else if (UV >= 8 && UV <= 10) {
                    $(UVbold).attr("class", "card text-white bg-warning mb-3");
                }
                else {
                    $(UVbold).attr("class", "card text-white bg-danger mb-3");
                }
                // Creates multiple rows for double digit numbers



                // Get 5-day forecast: date, icon, temp, and humidity

                $("#five-day").empty(); // Removes previous cities forecast

                $("#five-day").html("<h4> 5-Day Forecast");

                for (var i = 0; i < onecall.daily.length; i++) {

                    if (i > 4){
                        break;
                    }

                    var figure = $("<figure>");
                    $("#five-day").append(figure);
                    $(figure).attr("class", "card text-white bg-primary");
                    $(figure).attr("style", "width: 8rem;");

                    
                    var dailyDate = moment(onecall.daily[i].dt * 1000).format("MM / DD / YY");
                    var dailyIcon = onecall.daily[i].weather[0].icon;
                    var dailyTempK = onecall.daily[i].temp.day;
                    var dailyTempF = $("<p>").html("Temp: " + (Math.round((dailyTempK * (9 / 5)) - 459.67) +
                        " &#8457"));
                    var dailyHumidity = $("<p>").html("Humidity: " + onecall.daily[i].humidity + "%");

                    var futureiconEl = $("<img>");
                    var futureiconURL = "http://openweathermap.org/img/wn/" + dailyIcon + "@2x.png";
                    var futurecityIcon = $(futureiconEl).attr("src", futureiconURL);

                    $(figure).append(dailyDate);
                    $(figure).append(futurecityIcon);
                    $(figure).append(dailyTempF);
                    $(figure).append(dailyHumidity);

                }

        }) // Second Ajax Call
    }) // First Ajax Call        
} // Onload Function