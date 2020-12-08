const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser')
const { request, response } = require('express');
const db = require('./db')
let data = require('./data')

const app = express();

const port = process.env.PORT ||3004
app.use(cors());
app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.send('Welcome to places API');
});

app.get('/places', (request, response) => {
    response.json(data.places);
});

app.post('/place' , (request, response) => {
    let name = request.body.name;
    let city = request.body.city;
    let state = request.body.state;
    let place = {name: name, city: city, state: state, reviews: []};
    data.places.push(place);
});
app.post('/review/:placeId' , (request, response) => {
    let searchFor = request.params.placeId;
    let found = data.places.find(x => x.name == request.params.placeID);
    if(found) {
        found.reviews.push(request.body.review);
    }
    else{
        response.status(404).json({error: `The question ${searchFor} could not be found`});
    }
});
app.get('/search/:searchTerm/:location', (request, response) => {
    let [city, state] = request.params.location.split(',');
    let searchTerm = request.params.searchTerm;
    let locationPlaces = data.places.filter(x => x.state === state 
        && x.city === city && (searchTerm == '$None' || x.name.includes(searchTerm) || x.description.includes(searchTerm)));
    if(locationPlaces) {
        response.json(locationPlaces);
    }
    else{
        response.status(404).json({error: `No results for ${city} could be found`});
    }
});
app.get('/place/:name', (request, response) => {
    let searchFor = request.params.name;
    let found = data.places.find(x => x.name === searchFor);
    if(found) {
        response.json(found);
    }
    else {
        response.status(404).json({error: `The question ${searchFor} could not be found`});
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});