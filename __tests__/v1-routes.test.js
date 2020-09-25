'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../server.js');
const myServer = supergoose(server.app);
require('dotenv').config();

describe('Proof of Life test', () => {
  it('Proof of life', () => {
    expect(true).toBeTruthy();
  });
});

describe('Test V1 Routes', () => {
  it('POST /api/v1/todo adds an item to the DB and returns an object with that item', async() => {
    let obj = {
      text: 'text1',
      assignee: 'assignee1',
      complete: false,
      difficulty: 3,
    };
    let response = await myServer.post('/api/v1/todo').send(obj);
    expect(response.status).toEqual(200);
    expect(response.body._id).toBeDefined();
    Object.keys(obj).forEach(key => {
      expect(obj[key]).toEqual(response.body[key]);
    });
  });

  it('GET should return all', async() => {
    let obj2 = {
      text: 'text1',
      assignee: 'assignee1',
      complete: false,
      difficulty: 3,
    };
    let added = await myServer.post('/api/v1/todo').send(obj2);
    let response = await myServer.get('/api/v1/todo');
    expect(response.status).toEqual(200);
    expect(response.body.count).toEqual(2);
  });
});