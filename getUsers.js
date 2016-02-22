var Twit = require('twit');
var twit = new Twit({
    consumer_key:         'HYg998LocV9a0V9HVv31U7eTT'
  , consumer_secret:      'b9uWHnSljdRfUyjVZxt4dq72Fyf1ZNqyNKkWmAiecG7dJWDQ6J'
  , access_token:         '3532303048-ED53CIpIlVCQGSlFHgj5HQRE8FUkT1M6e7B10ys'
  , access_token_secret:  'RLgMCCZvq2ueRs7Irm6PvFUx5i8Idq5eM4eZvfMF1Gsa6'
});

// Writing...
var fs = require("fs");
var json = [];

twit.get('friends/ids', { user_id: '3532303048', stringify_ids: true }, function (err, data, response) {
	json = data.ids;
	console.log("Nombre de users: " + json.length);
	fs.writeFile( "users.json", JSON.stringify( json ), "utf8", function(){} );
});

