'use strict';

const express = require('express');
const router = express.Router();

const basicAuth = require('../middleware/basic.js');
const bearer = require('../middleware/bearer.js');
const can = require('../middleware/acl.js');
const users = require('../models/users-model.js');

router.post('/signup', async (req, res, next) => {

  try {
    let obj = {
      username: req.body.username,
      password: req.body.password,
      role: req.body.role,
    };

    let record = new users(obj);
    let newUser = await record.save();
    let token = record.generateToken();

    res.set('auth', token);

    let output = {
      token: token,
      user: newUser,
    };
    res.status(200).json(output);

  } catch (e) {
    next(e.message);
  }
});


router.post('/signin', basicAuth, (req, res, next) => {
  res.set('auth', req.token);
  let object = {
    token: req.token,
    user: req.user,
  };
  res.status(200).json(object);
});

router.get('/secret', bearer, (req, res) => {
  res.status(200).send(`Welcome, ${req.user.username}`);
});

router.get('/article', bearer, can('read'), (req, res) => {
  res.status(200).send('You can read it');
});

router.post('/article', bearer, can('create'), (req, res) => {
  res.status(200).send('You can create it');
});

router.put('/article', bearer, can('update'), (req, res) => {
  res.status(200).send('You can update it');
});

module.exports = router;
