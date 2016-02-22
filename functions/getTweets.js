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

twit.get('statuses/user_timeline', { id: '', count: 200 }, function cb(err, data, response) {
	
	if(data.length != 0) {
		for(var i = 0 ; i < data.length ; i++) {
			json.push(data[i].id_str);
  		}
		twit.get('/statuses/user_timeline', { id: '', count: 200, max_id: data[data.length-1].id }, cb);
	} else {
		console.log("Nombre de tweets: " + json.length);
		fs.writeFile( "tweets.json", JSON.stringify( json ), "utf8", function(){} );
	}
});


