var model = require('./model');

model.createUser('Sebastian', 'tbhtinapw', function(error) {
  if (error) {
    console.log("Error inserting user: " + error);
  } else {
    console.log("User inserted successfully!");
  }
});
