'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../server.js');
const request = supergoose(server.app);
const jwt = require('jsonwebtoken');
require('dotenv').config();