'use strict';

const express = require('express');
const router = express.Router();

const basicAuth = require('../middleware/basic.js');
const bearerAuth = require('../middleware/bearer.js');
const can = require('../middleware/acl.js');
const userModel = require('../models/users-model.js');

router.post('/signup', async (req, res, next) => {

  try {
    let obj = {
      username: req.body.username,
      password: req.body.password,
      role: req.body.role,
    };

    let record = new userModel(obj);
    let newUser = await record.save();
    let token = record.generateToken();

    let output = {
      token: token,
      user: newUser,
    };
    res.set('auth', token);
    res.status(200).json(output);
  } catch (e) {
    next(e.message);
  }
});


router.post('/signin', basicAuth, (req, res, next) => {
  try {
    let object = {
      token: req.token,
      user: req.user,
    };
    res.set('auth', req.token);
    res.status(200).json(object);
  } catch(e) {
    next(e.message);
  }
});

router.get('/secret', bearerAuth, (req, res) => {
  res.status(200).send(`Welcome, ${req.user.username}`);
});

router.get('/article', bearerAuth, can('read'), (req, res) => {
  res.status(200).send('You can read it');
});

router.post('/article', bearerAuth, can('create'), (req, res) => {
  res.status(200).send('You can create it');
});

router.put('/article', bearerAuth, can('update'), (req, res) => {
  res.status(200).send('You can update it');
});

module.exports = router;
