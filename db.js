'use strict';

require('dotenv').config();
const { Pool } = require('pg');


const postgreConnectionString =
    `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`;

console.log(postgreConnectionString);

const postgrePool = new Pool({
    connectionString: process.env.DATABASE_URL ? process.env.DATABASE_URL : postgreConnectionString,
    ssl: { rejectUnauthorized: false }
});

function getPlaces() {
    return postgrePool.query('select * FROM nearbyplaces.places').then(x => x.rows);
}
function getPlace(name){
    return postgrePool.query('SELECT * FROM nearbyplaces.places WHERE "name"= $1', [name]).then(x => x.rows);
}
function savePlace(name, city, state, description) {
    return postgrePool.query('INSERT INTO nearbyplaces.places ("name", city, state, description, reviews) VALUES ($1, $2, $3, $4, $5)', [name, city, state, description, ""]); 
}
function deletePlace(name) {
    return postgrePool.query('DELETE FROM nearbyplaces.places WHERE "name"= $1 returning *', [name]).then(x => x.rows);
}
function placeReview(name, review) {
    return postgrePool.query('UPDATE nearbyplaces.places SET reviews=$1 WHERE "name"= $2' , [review, name]).then(x => x.rows);
}
function getReview(name) {
    return postgrePool.query('SELECT reviews FROM nearbyplaces.places WHERE "name"= $1', [name]).then(x => x.rows);
}
function searchLocation(city, state, searchTerm) {
    postgrePool.query(`SELECT * FROM nearbyplaces.place WHERE city LIKE '${city}' AND state LIKE '${state}' AND NAME' LIKE '${searchTerm}'`).then(x => x.rows);

}
module.exports = {getPlaces, savePlace, deletePlace,getPlace, placeReview, getReview, searchLocation}