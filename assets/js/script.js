var apiKey = '2f95f51b181ddd27883e91878e922466'; // assign our key to a variable, easier to read
 
// the next line and function set up the button in our html to be clickable and reactive 
document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
	document.getElementById('submitZip').addEventListener('click', function(event){
		event.preventDefault();
		var zip = document.getElementById('zip').value; // this line gets the zip code from the form entry
		var size = document.getElementById('size').value;
		var age = document.getElementById('age').value;
		var sex = document.getElementById('sex').value;
		var url = 'http://api.petfinder.com/pet.find';
		
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
				console.log(response); // debugging
				var pet = response.petfinder.pets.pet;
				var dogName = pet.name.$t;
				var img = './assets/img/logo.png';
				if (pet.media.photos && pet.media.photos.photo[3]) {
					img = pet.media.photos.photo[3].$t;
				}
				var id = pet.id.$t;
				var breed = pet.breeds.breed.$t;

                var newName = document.createElement('h3');
                newName.setAttribute('class','card-title');
				newName.textContent = dogName;
				var breedEl = document.createElement('p');
				breedEl.textContent = breed;
                
                
                var divCol = document.createElement('div');
                divCol.setAttribute('class','col s2');
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
				
				var rowEl = document.getElementById('card-row');
                
                
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