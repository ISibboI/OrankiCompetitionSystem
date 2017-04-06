var mongoose = require('mongoose');

exports.user = mongoose.Schema({
  name: {type: 'string', unique: true},
  password: {type: {
    hash: {type: 'string', required: true},
    salt: {type: 'string', required: true}
  }, required: true},
  creationTimestamp: {type: 'date', required: true},
  isAdmin: {type: 'bool', default: false, index: true}
});
