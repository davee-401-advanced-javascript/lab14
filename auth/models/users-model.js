'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'guest', enum: ['guest', 'author', 'editor', 'admin'] },
});

const roles = {
  guest: ['read'],
  author: ['read', 'create'],
  editor: ['read', 'update', 'delete'],
  admin: ['read', 'create', 'update', 'delete '],
};

users.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

users.methods.can = function (capability) {
  return roles[this.role].includes(capability);
};


users.methods.generateToken = function () {
  let tokenObject = {
    username: this.username,
    role: this.role,
    permissions: roles[this.role],
  };
  let token = jwt.sign(tokenObject, process.env.SECRET);
  return token;
};


users.statics.validateBasic = async function (username, password) {

  let user = await this.findOne({ username: username });
  let isValid = await bcrypt.compare(password, user.password);

  if (isValid) { return user; }
  else { return undefined; }

};

users.statics.authenticateWithToken = async function (token) {
  try {
    const parsedToken = jwt.verify(token, process.env.SECRET);
    const user = this.findOne({ username: parsedToken.username });
    return user;
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = mongoose.model('users', users);
