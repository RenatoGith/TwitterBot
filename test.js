var fs = require("fs");
var users = require("./users.json");
var tweets = require("./tweets.json");

for(var i = 0; i < users.length ; i ++) {
	console.log("User : " + users[i]);
}
