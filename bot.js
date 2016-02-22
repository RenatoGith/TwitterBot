var Twit = require('twit');

var twit = new Twit({
    consumer_key:         '4IaRjCcpskIi41YncCFk2L8pr'
  , consumer_secret:      'Tc586qruL9wFaQfN1cqXIXvITFh7SpoasNtu3fxgGSRd0UBZyS'
  , access_token:         '3532303048-jnc09Ic6m3HlNtVs3NynfoNjAsQAq8blIa4h4uF'
  , access_token_secret:  'zsbzpt0XSC2Q5GHC48YZszK4JLcI1VwrV7Z3qW6RvpPUS'
});

//create stream
var stream = twit.stream('statuses/filter', { track: 'rt follow concours,rt follow gagner,rt follow gagne', language: 'fr' });

//listen stream data
stream.on('tweet', function(tweet) {

	//if tweet is a retweet
	if(tweet.hasOwnProperty("retweeted_status")) {
		//get tweet original
		tweet = tweet.retweeted_status;
  	} else if (tweet.hasOwnProperty("quoted_status")) {
  		tweet = tweet.quoted_status;
  	}

  	// if I haven't retweeted it
  	if(tweet.retweeted == false) {
  		// follow & rt
  		twit.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {console.log(data)});
	  	twit.post('friendships/create', { user_id: tweet.user.id_str, follow: true }, function (err, data, response) {console.log(data)});
	  	//console.log(tweet.text);
  	}
});

  


