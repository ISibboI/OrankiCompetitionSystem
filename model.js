var schemas = require('./schemas');
var mongoose = require('mongoose');
mongoose.Promise = require('es6-promise').Promise;
var bcrypt = require('bcrypt');

const saltRounds = 10;

var mongoOptions = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }, reconnectTries: 10, reconnectInterval: 1000 },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
var db = mongoose.createConnection('localhost', 'OCS', mongoOptions);

User = db.model('User', schemas.user);
User.on('index', function(err) {
    if (err) {
        console.error('User index error: %s', err);
    } else {
        console.info('User indexing complete');
    }
});

function generateSalt() {
  return bcrypt.genSaltSync(saltRounds);
}

function hashPassword(password, salt) {
  return bcrypt.hashSync(password, salt);
}

exports.createUser = function(_name, _password, callback) {
  _salt = generateSalt();
  _creationTimestamp = new Date().getTime();

  user = new User({
    name: _name,
    password: {
      hash: hashPassword(_password, _salt),
      salt: _salt
    },
    creationTimestamp: _creationTimestamp,
    isAdmin: false
  });

  user.save(callback);
}

console.log('Model loaded');
