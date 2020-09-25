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

describe('It should log a 404 for a route thats not present', ()=> {
  it('Should give a 404 for bad route', async() => {
    let response = await myServer.get('/bad');
    expect(response.status).toEqual(404);
  });
});

describe('POST /signup should work', () => {
  it('Should create a new user', async()=> {
    let obj = {
      username: 'davee',
      password: 'davee',
      role: 'admin',
    };
    let response = await myServer.post('/signup').send(obj);
    const parsedToken = jwt.verify(response.body.token, process.env.SECRET);
    expect(parsedToken.username).toEqual('davee');
    expect(parsedToken.role).toEqual('admin');
    expect(parsedToken.permissions).toBeDefined();
    expect(response.status).toEqual(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.username).toEqual('davee');
  });
});

describe('POST /signin should work', () => {
  it('POST /signin should work with correct authorization', async() => {
    let response = await myServer.post('/signin').auth('davee','davee');
    expect(response.body.token).toBeDefined();
    expect(response.status).toEqual(200);
  });
});

