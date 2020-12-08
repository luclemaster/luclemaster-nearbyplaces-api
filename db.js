'use strict';

require('dotenv').config();
const { Pool } = require('pg');

const postgreConncetionString = `postgresql://${process.env.POSTGRES_USER}.`