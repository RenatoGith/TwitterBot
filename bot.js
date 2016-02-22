//requires
var Twit = require('twit');
var moment = require('moment');
var fs = require('fs');

//jsons required
var users = require('./data/users.json');
var tweets = require('./data/tweets.json');
var userBlacklist = require ('./blacklists/userBlacklist.json');
var wordBlacklist = require ('./blacklists/wordBlacklist.json');
var config = require('./config/config.json');

//twitter API authentification
var twit = new Twit({
    consumer_key:         config.cons_key
  , consumer_secret:      config.cons_sec
  , access_token:         config.acc_tok
  , access_token_secret:  config.acc_tok_sec
});

//counter of retweets during DURATION
var c = 0; 

//date of last reset
var d = new Date();
var m = moment(d);

//bool true if wainting message already displayed
var waiting = false;

//return true if id parameter is found in the tweets already rt list (tweets.json)
function strFoundInList(str, list) {
        var res = false;
        for(var i = 0 ; i < list.length ; i++) {
                if(str.localeCompare(list[i]) == 0) {
                        res = true;
                        break;
                }
        }
        return(res);
}

//return true if id parameter is found in the tweets already rt list (tweets.json)
function isAlreadyRetweeted(tweet_id) {
	return(strFoundInList(tweet_id, tweets));
}

//return true if id parameter is found in the friend list (users.json)
function isAlreadyFriend(user_id) {
        return(strFoundInList(user_id, users));
}

//return true if id in parameter is found in the user id blacklist (userBlacklist.json) 
function isInUserBlacklist(user_id) {
        return(strFoundInList(user_id, userBlacklist));
}

//return true if a word of the blacklist is found in the tweet (wordBlacklist.json)
function isBlacklistWordInText(text) {
	var res = false;
        for(var i = 0 ; i < wordBlacklist.length ; i++) {
                if(text.indexOf(' ' + wordBlacklist[i] + ' ') > -1) {
                        res = true;
                        break;
                }
        }
        return(res);
}

//return true if number of follows reaches max
function isMaxFriendsReached(id, max) {
	twit.get('users/show', { user_id: id }, function(err, data, response) {
		var res = false;
		//if id.friends > max
        	if(data.friends_count > max) {
			res = true;
        	}
		return(res);
	});
}

//create stream
var stream = twit.stream('statuses/filter', { track: config.tags, language: config.lang });

//listen stream data
stream.on('tweet', function(tweet) {
	
	//date of last tweet
	var dn = new Date();
	var mn = moment(dn);
	
	//seconds from last reset
	var sdiff = mn.diff(m, 'seconds');

	//if DURATION finish
	if(sdiff > config.duration) {
		//reset counter and waiting bool, new date of last reset,
		console.log("Reset");
		c = 0;
		m = mn;
		waiting = false;
	}  
	
	//if counter => counter max		
	if(c >= config.cmax) {
		if(!waiting) {
                        var wtime = config.duration - mn.diff(m, 'seconds');
                        console.log("Waiting " + wtime + "s for reset...");
                        waiting = true;
                }
	} else {
		//while tweet is a retweet
		while(tweet.hasOwnProperty("retweeted_status")) {
			//tweet become the original tweet
			tweet = tweet.retweeted_status;
		}
		
		//if tweet is a quote
                if(tweet.hasOwnProperty("quoted_status")) { 
                	console.log("Tweet Quote");
                } else {
			//if tweet's author is in blacklist
			if(isInUserBlacklist(tweet.user.screen_name)) {
				console.log("Tweet User Blacklist");
			} else {
				//if tweet contains blacklist words 
				if(isBlacklistWordInText(tweet.text)) {
					console.log("Tweet Word Blacklist");
				} else {
					// if tweet has been aready retweeted 
  					if(isAlreadyRetweeted(tweet.id_str)) {
  						console.log("Tweet Already RT");
					} else {
						//post retweet via API, push tweet id in tweets.json, increment counter of retweet
						c++;
						twit.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {});
						tweets.push(tweet.id_str);
						console.log("Tweet OK from " + tweet.user.screen_name + ": " + tweet.text.split("\n"));
						
						//if tweet's author is not a friend	
						if(!isAlreadyFriend(tweet.user.id_str)) {	
							//post friendship via API, push user id in users.json
							twit.post('friendships/create', { user_id: tweet.user.id_str, follow: true }, function (err, data, response) {});
	  						users.push(tweet.user.id_str);
							console.log("   Author followed: " + tweet.user.screen_name);
							
							//if MAXFRIENDS reached
							if(isMaxFriendsReached(config.acc_tok.split("-",1)[0], config.maxfriends)) {
                                                                //stop the stream (close the bot)
                                                                stream.stop();
                                                                console.log("Too many friends : stop stream");
							}
						}
						
						//if FOLLOWMENTIONS = true
						if(config.followmentions) {
							//for each users mentionned in tweet
							for (var i = 0 ; i < tweet.entities.user_mentions.length ; i++) {
								//if user is not a friend
								if(!isAlreadyFriend(tweet.entities.user_mentions[i].id_str)) {
									//post friendship via API, push user id in users.json
									twit.post('friendships/create', { user_id: tweet.entities.user_mentions[i].id_str, follow: true}, function (err, data, response) {});
									users.push(tweet.entities.user_mentions[i].id_str);
									console.log("   Mentionned user followed: " + tweet.entities.user_mentions[i].screen_name);
								}
                                                        	
								//if MAXFRIENDS reached
                                                        	if(isMaxFriendsReached(config.acc_tok.split("-",1)[0], config.maxfriends)) {
                                                                	//stop the stream (close the bot)
                                                                	stream.stop();
                                                                	console.log("Too many friends : stop stream");
                                                        	}
							}
						}
						
						//if text contains fav
						if(tweet.text.indexOf('Fav') > -1 || tweet.text.indexOf('fav') > -1 || tweet.text.indexOf('FAV') > -1) {
							//post favorite via API
							twit.post('favorites/create', { id: tweet.id_str }, function (err, data, response) {});
							console.log("   Favorite");
						}

						//write jsons
						fs.writeFile( "tweets.json", JSON.stringify( tweets ), "utf8", function(){} );
						fs.writeFile( "users.json", JSON.stringify( users ), "utf8", function(){} );						
					}
				}
			}
		}
	}
});



