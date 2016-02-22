var Twit = require('twit');
var twit = new Twit({
    consumer_key:         ''
  , consumer_secret:      ''
  , access_token:         ''
  , access_token_secret:  ''
});

// Writing...
var fs = require("fs");
var json = [];

twit.get('friends/ids', { user_id: '', stringify_ids: true }, function (err, data, response) {
	json = data.ids;
	console.log("Nombre de users: " + json.length);
	fs.writeFile( "users.json", JSON.stringify( json ), "utf8", function(){} );
});

