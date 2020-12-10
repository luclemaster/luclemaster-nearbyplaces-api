const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser')
const db = require('./db')
let data = require('./data');
const { request, response } = require('express');
const { getPlace } = require('./db');

const app = express();

const port = process.env.PORT ||3004
app.use(cors());
app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.send('Welcome to places API');
});

app.get('/places', (request, response) => {
    //response.json(data.places);
    db.getPlaces().then(x => response.json(x));
});

app.post('/place' , (request, response) => {
    let name = request.body.name;
    let city = request.body.city;
    let state = request.body.state;
    let description = request.body.description;
    //let place = {name: name, city: city, state: state, reviews: []};
    //data.places.push(place);
    db.savePlace(name, city, state, description);
});

app.get('/delete/:name', (request, response) => {
    db.deletePlace(request.params.name).then(x => response.json(x));
});

app.post('/review/:placeId/' , (request, response) => {
    // add functionality to combine old and new review
    db.getReview(request.params.placeId).then(x => x.json()).then(y => {
        let review = y[0].reviews;
        if(review.length > 0){
            review += ', ' + request.body.review;
        }
        else {
            review = request.body.review;
        }
        db.placeReview(request.params.placeId, review);
    });

    //let collectedReview = review.then(x => x[0].reviews);
    //if(collectedReview.length > 0) {
    //    collectedReview += ', ' + request.params.review;
    //} else {
    //    collectedReview = request.params.review;
    //}
    //var teststring = '';
    //collectedReview.then(x => teststring = x);
    response.json(review);
    //
    //response.json(review);
    //if(review.length >0) {
    //    review += ', ' + request.body.review
    //} else {
    //    review = request.body.review
    //}
    
    //db.placeReview(name, review);
});
app.get('/search/:searchTerm/:location', (request, response) => {
    let [city, state] = request.params.location.split(',');
    let searchTerm = request.params.searchTerm;
    if (searchTerm == '$None') {
        searchTerm = ''
    }
    db.searchLocation(city, state, searchTerm).then(x => response.json(x));
});
app.get('/place/:name', (request, response) => {
    db.getPlace(request.params.name).then(x => response.json(x));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
