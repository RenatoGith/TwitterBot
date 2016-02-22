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

twit.get('statuses/user_timeline', { id: '3532303048', count: 200 }, function cb(err, data, response) {
	
	if(data.length != 0) {
		for(var i = 0 ; i < data.length ; i++) {
			json.push(data[i].id_str);
  		}
		twit.get('/statuses/user_timeline', { id: '3532303048', count: 200, max_id: data[data.length-1].id }, cb);
	} else {
		console.log("Nombre de tweets: " + json.length);
		fs.writeFile( "tweets.json", JSON.stringify( json ), "utf8", function(){} );
	}
});


