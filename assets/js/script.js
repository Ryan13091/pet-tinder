var apiKey = '2f95f51b181ddd27883e91878e922466'; // assign our key to a variable, easier to read
var cardWeatherEl = document.querySelector("#weather-card");
var addTempEl = document.getElementById('temp');
var rowEl = document.getElementById('card-row');
var forecastTitelEl = document.getElementById('forecast');
var cardDayEl = document.getElementById('daycards');
// the next line and function set up the button in our html to be clickable and reactive 
document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
	document.getElementById('submitZip').addEventListener('click', function(event){
		event.preventDefault();
		var zip = document.getElementById('zip').value; // this line gets the zip code from the form entry
		var size = document.getElementById('size').value;
		var age = document.getElementById('age').value;
		var sex = document.getElementById('sex').value;
		var url = 'https://api.petfinder.com/pet.find';
		
		// Within $.ajax{...} is where we fill out our query 
		$.ajax({
			url: url,
			jsonp: "callback",
			dataType: "jsonp",
			data: {
				count: 1,
				size: size,
				age: age,
				sex: sex,
				key: apiKey,
				animal: 'dog',
				'location': zip,
				output: 'basic',
				format: 'json'
			},
			// Here is where we handle the response we got back from Petfinder
			success: function( response ) {
				rowEl.innerHTML = '';
				var pet = response.petfinder.pets.pet;
				var dogName = pet.name.$t;
				var img = './assets/img/logo.png';
				if (pet.media.photos && pet.media.photos.photo[3]) {
					img = pet.media.photos.photo[3].$t;
				}
				var id = pet.id.$t;
				var breed = pet.breeds.breed.$t;
				var city = pet.contact.city.$t;
				getCity(city);

                var newName = document.createElement('h3');
                newName.setAttribute('class','card-title');
				newName.textContent = dogName;
				var breedEl = document.createElement('p');
				breedEl.setAttribute('class','p2');
				breedEl.textContent = breed;
                
                
                var divCol = document.createElement('div');
				divCol.setAttribute('class','pet col s3');
				divCol.setAttribute('id','dog-img');
                var divCard = document.createElement('div');
                divCard.setAttribute('class','card blue-grey darken-1');
                var divImg = document.createElement('div');
                divImg.setAttribute('class','card-image');
                var divInfo = document.createElement('div');
                divInfo.setAttribute('class','card-content');
                var divLink = document.createElement('div');
                divLink.setAttribute('class','card-action');
                var linkEl = document.createElement('a');
                linkEl.textContent = 'Adopt me!';
                linkEl.href = 'https://www.petfinder.com/petdetail/' + id;
                linkEl.target = '_blank';


				var newImg = document.createElement('img');
				newImg.setAttribute('class','dog-img');
				newImg.src = img;
				
				// var rowEl = document.getElementById('card-row');
                
                
                divImg.appendChild(newImg);
				divInfo.appendChild(newName);
				divInfo.appendChild(breedEl);
                rowEl.appendChild(divCol);
                divCol.appendChild(divCard);
                divCard.appendChild(divImg);
                divCard.appendChild(divInfo);
                divCard.appendChild(divLink);
                divLink.appendChild(linkEl);

				
			}
		});
		})

}

var getCity = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=c6ee42eed2ff19934f4074a3340902d5";

    var apiForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=c6ee42eed2ff19934f4074a3340902d5";

    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                cardWeatherEl.innerHTML = '';
                addTempEl.innerHTML = '';
                response.json().then(function (data) {
                    // console.log(data)
                    displayWeather(data);

                })
            };

        });

    fetch(apiForecast)
        .then(function (response) {
            forecastTitelEl.innerHTML = '';
            cardDayEl.innerHTML = '';
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {

                    getForecast(data);

                })
            };
        });
};
// function to creted the display weather for today
var displayWeather = function (data) {

    var iconEl = document.createElement('img');
    iconEl.className = 'img-icon';
    iconEl.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);

    var tempEl = document.createElement('p');
    tempEl.textContent = 'Temperature: ' + data.main.temp + ' °F';

    var humidityEl = document.createElement('p');
    humidityEl.textContent = 'Humidity: ' + data.main.humidity + '%';


    var speedEl = document.createElement('p');
    speedEl.textContent = 'Wind Speed: ' + data.wind.speed + ' MPH';

    var rightNow = moment().format("M/D/YYYY");

    var titleCityEl = document.createElement('h2');
    titleCityEl.textContent = data.name + ' ' + rightNow;

    var lat = data.coord.lat;
    var lon = data.coord.lon;
    var apiUV = "https://api.openweathermap.org/data/2.5/uvi?&appid=c6ee42eed2ff19934f4074a3340902d5&lat=" + lat + "&lon=" + lon;

    fetch(apiUV)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (dataUV) {

                    var uvEl = document.createElement('p');
                    var indexEl = document.createElement('span');

                    if (dataUV.value < 3) {
                        indexEl.className = 'bajo';
                    } else if (dataUV.value < 5) {
                        indexEl.className = 'moderado';
                    } else if (dataUV.value < 7) {
                        indexEl.className = 'alto';
                    } else if (dataUV.value < 10) {
                        indexEl.className = 'muy-alto';
                    } else {
                        indexEl.className = 'extremo';
                    }

                    uvEl.textContent = 'UV Index:';
                    indexEl.textContent = dataUV.value;

                    addTempEl.appendChild(uvEl);
                    uvEl.appendChild(indexEl);
                })
            };

        });

    cardWeatherEl.appendChild(titleCityEl);
    titleCityEl.appendChild(iconEl);
    addTempEl.appendChild(tempEl);
    addTempEl.appendChild(humidityEl);
    addTempEl.appendChild(speedEl);

}
// function to creted the display weather for 5 days
var getForecast = function (data) {
    // console.log(data)
    var titleForecastEl = document.createElement('h2');
    titleForecastEl.textContent = '5-Day Forecast:';

    for (var i = 5; i < data.list.length; i = i + 8) {

        var foreCardEl = document.createElement('li');
        foreCardEl.className = 'card col s1 list-group-item margin card-style';
        // list-group-item-primary
        cardDayEl.appendChild(foreCardEl);



        var dateEl = document.createElement('h3');
        dateEl.textContent = moment(data.list[i].dt_txt).format("M/D/YYYY");

        var tempEl = document.createElement('p');
        tempEl.className = 'p2';
        tempEl.textContent = 'Temperature: ' + data.list[i].main.temp + ' °F';

        var humidityEl = document.createElement('p');
        humidityEl.className = 'p2';
        humidityEl.textContent = 'Humidity: ' + data.list[i].main.humidity + '%';;

        var iconEl = document.createElement('img');
        iconEl.setAttribute('src', `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`);


        foreCardEl.appendChild(dateEl);
        foreCardEl.appendChild(iconEl);
        foreCardEl.appendChild(tempEl);
        foreCardEl.appendChild(humidityEl);
    }

    forecastTitelEl.appendChild(titleForecastEl);
}