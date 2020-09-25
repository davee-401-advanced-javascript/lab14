'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../server.js');
const myServer = supergoose(server.app);
const jwt = require('jsonwebtoken');
require('dotenv').config();

describe('Proof of Life test', () => {
  it('Proof of life', () => {
    expect(true).toBeTruthy();
  });
});