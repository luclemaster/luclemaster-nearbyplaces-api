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
    return postgrePool.query('INSERT INTO nearbyplaces.places VALUES (name, city, state, description) values ($1, $2, $3, $4) returning name', [name, city, state, description])
    .then(x => x.rows); 
}
module.exports = {getPlaces, savePlace}