var express = require('express')
var bodyParser = require('body-parser')
var model = require('./model')
var secrets = require('./secrets')

var app = express()
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))
app.use(require('express-nocaptcha')({secret: secrets.googleAPISecretKey}))

app.locals.settings['x-powered-by'] = false
app.locals.site = {
  title: 'Pesä Competition',
  description: 'A competition system for the little boulder cave Pesä in JMT 3A'
}
app.locals.author = {
  name: 'Sebastian Schmidt'
}

function displayError(res, referer, error) {
  res.render('error', {'referer': referer, 'error': error})
}

console.log('Settings:\n', app.locals)

app.get('/', function(req, res) {
  res.render('mainPage')
})

app.get('/register', function(req, res) {
  res.render('register', {googleAPIWebsiteKey: secrets.googleAPIWebsiteKey})
})

app.post('/register', function(req, res) {
  if (!('name' in req.body) || !('password' in req.body)) {
    displayError(res, '/register', 'Missing parameters!')
    return
  }

  if (!req.validnocaptcha) {
    displayError(res, '/register', 'Captcha was unsuccessful!')
    return
  }

  if (req.body.name.length < 2 || req.body.name.length > 32) {
    displayError(res, '/register', 'Usernames must be between 2 and 32 characters long!')
    return
  }

  if (req.body.password.length < 8 || req.body.password.length > 1024) {
    displayError(res, '/register', 'Passwords must be between 8 and 1024 characters long!')
    return
  }

  model.createUser(req.body.name, req.body.password, function(error) {
    if (error) {
      displayError(res, '/register', error)
      return
    }

    res.render('mainPage', {message: 'Registration successful. Please log in!'})
  })
})

app.listen(8080, function() {
  console.log('Listening on port 8080!')
})
