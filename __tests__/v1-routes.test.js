'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../server.js');
const request = supergoose(server.app);
require('dotenv').config();

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