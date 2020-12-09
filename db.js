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
function savePlace(name, city, state, description) {
    return postgrePool.query('INSERT INTO nearbyplaces.places ("name", city, state, description, reviews) VALUES ($1, $2, $3, $4, $5)', [name, city, state, description, ""]); 
}
function deletePlace(name) {
    return postgrePool.query('DELETE FROM nearbyplaces.places WHERE "name"= $1', [name]);
}
module.exports = {getPlaces, savePlace, deletePlace}