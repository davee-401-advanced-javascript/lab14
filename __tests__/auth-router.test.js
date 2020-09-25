'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../server.js');
const request = supergoose(server.app);
const jwt = require('jsonwebtoken');
require('dotenv').config();


describe('Proof of Life test', () => {
  it('Proof of life', () => {
    expect(true).toBeTruthy();
  });
});

describe('It should log a 404 for a route thats not present', ()=> {
  it('Should give a 404 for bad route', async() => {
    let response = await request.get('/bad');
    expect(response.status).toEqual(404);
  });
});

describe('Post to /signup should work', () => {
  it('Should create a new user', async()=> {
    let obj = {
      username: 'davee',
      password: 'davee',
      role: 'admin',
    };
    let response = await request.post('/signup').send(obj);
    const parsedToken = jwt.verify(response.body.token, process.env.SECRET);
    expect(response.status).toEqual(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.username).toEqual('davee');
  });
});

describe('Post to /signin should work', () => {
  it('Post to /signin should work with correct authorization', async() => {
    let response = await request.post('/signin').auth('davee','davee');
    expect(response.body.token).toBeDefined();
  });
});

describe('Test V1 Routes', () => {
  it('Post should add to database', async() => {
    let obj = {
      text: 'text1',
      assignee: 'assignee1',
      complete: false,
      difficulty: 3,
    };
    let response = await request.post('/api/v1/todo').send(obj);
    expect(response.status).toEqual(200);
    expect(response.body._id).toBeDefined();
  });

  it('Get should return all', async() => {
    let obj2 = {
      text: 'text1',
      assignee: 'assignee1',
      complete: false,
      difficulty: 3,
    };
    let added = await request.post('/api/v1/todo').send(obj2);
    let response = await request.get('/api/v1/todo');
    console.log('response.body', response.body);
    expect(response.status).toEqual(200);
    expect(response.body.count).toEqual(2);
  });
});