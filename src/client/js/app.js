/* Global Variables */
const baseURL = 'http://api.geonames.org/searchJSON?q=';
const apiKey = '&username=hardik100';

const weatherURL = 'https://api.weatherbit.io/v2.0/forecast/daily?city=';
const weatherKey = '&key=0137b749039d4a929fd8b476feb724bb';

const pixabayURL = 'https://pixabay.com/api/?key=';
const pixabaykey = '16714810-99fa5c441b1556de45baf46bc';

const postData = async ( url = '', data = {})=>{
      const response = await fetch(url, {
      method: 'POST', 
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json',
      },
     // Body data type must match "Content-Type" header        
      body: JSON.stringify(data), 
    });

      try {
        const newData = await response.json();
        console.log(newData);
        return newData;
      }catch(error) {
      console.log("error", error);
      }
  }

//Create an event listener for the element with the id: submit, with a function to execute when it is clicked.

document.addEventListener('DOMContentLoaded', function () {
const generate = document.getElementById('submit')
generate.addEventListener('click', performAction);
});

async function performAction() {
  document.getElementById('displaytrip').style.cssText = 'display: block; text-align: center';
  let localData = {}
  let geoData = {}
  let weatherData = {}
  let pictureData = {}
  let destination =  document.getElementById('destination').value;
   
  geoData = await geonamesApi(baseURL, destination, apiKey)
  console.log(geoData);
  
  weatherData = await weatherbitApi(weatherURL, destination, weatherKey)
  console.log(weatherData);

  pictureData = await pixabayApi(pixabayURL, pixabaykey, destination)
  console.log(pictureData);
  localData.destination = geoData.geonames[0].name
  localData.country = geoData.geonames[0].countryName
  localData.latitude = geoData.geonames[0].lat
  localData.longitude = geoData.geonames[0].lng
  localData.highTemp = weatherData.data[0].high_temp
  localData.lowTemp = weatherData.data[0].low_temp
  localData.picture = pictureData.hits[0].webformatURL
  await postData('/add', localData);
  await datedifference()
  await handleUI()
}
function datedifference() {
  let startdate = document.getElementById('startdate').value;
  let enddate = document.getElementById('enddate').value;
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(startdate);
  const secondDate = new Date(enddate);
  const days = Math.round(Math.abs((firstDate - secondDate) / oneDay));
  console.log(days);
  document.getElementById('duration').innerHTML = `${days}`;
}
// geonames, weatherbit and pixabay Apis are asynchronous function that uses fetch() to make a GET request to the consecutive apis.
const geonamesApi = async(baseURL, destination, apiKey) => {
    const response = await fetch(baseURL + destination + apiKey);
    try {
        const data = await response.json();
        return data;
    } catch(error) {
    console.log('error',error);
     }
}

const weatherbitApi = async(weatherURL, destination, weatherKey) => {
  const response = await fetch(weatherURL + destination + weatherKey);
  try {
    const data = await response.json();
    return data;
  } catch(error) {
    console.log('error',error);
  }
}

const pixabayApi = async(pixabayURL, pixabaykey, destination) => {
  const response = await fetch(pixabayURL + pixabaykey + "&q=" + destination);
  try{
    const data = await response.json();
    return data;
  } catch(error) {
    console.log('error',error);
  }
}

//updating UI
const handleUI = async() => {
  const request = await fetch ('/all');
  try {
   const newEntry = await request.json();
   document.getElementById('city').innerHTML = newEntry.destination;
   document.getElementById('country').innerHTML = newEntry.country;
   document.getElementById('lat').innerHTML = newEntry.latitude;
   document.getElementById('lng').innerHTML = newEntry.longitude; 
   document.getElementById('hightemp').innerHTML = newEntry.highTemp;
   document.getElementById('lowtemp').innerHTML = newEntry.lowTemp; 
   document.getElementById('picture').innerHTML = `<img src=${newEntry.picture} alt="picture">`;
  }
  catch(error){
     console.log('error',error);
  }
}

export{performAction}


