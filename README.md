 	 ______       _ __  __          ___       __ 
 	/_  __/    __(_) /_/ /____ ____/ _ )___  / /_
 	 / / | |/|/ / / __/ __/ -_) __/ _  / _ \/ __/
 	/_/  |__,__/_/\__/\__/\__/_/ /____/\___/\__/ 

		
	This node.js bot allows to retweet and follow the author of tweets filtered in a stream.
	It uses the Twitter API client Twit (https://github.com/ttezel/twit).
	
	To use this bot, you have to create a Twitter App (https://apps.twitter.com/) with a twitter account (create a new one is a good idea)
	You have to fill the CON_KEY, CONS_SEC, ACC_TOK, ACC_TOK_SEC respectively with the Consumer Key, Consumer Secret, Access Token and Access Token Secret
	of your App. You will also have to fill ID with your account ID (that's the number before the '-' in the Access Token.

	So, you can specify two filters for the research of tweets : 
	- keywords in the tweet (<space> = 'and'  <,> = 'or') with TAGS const  
	- language of the tweet (en, fr ...) with LANG const

	You can also decide to follow users mentionned in tweets with the FOLLOWMENTIONS const.

	Twitter imposes limits :
	- 50 tweets by 1/2 hour (a retweet count for a tweet)
	- 2000 friends (users you follow) <- You can have more friends if you have high number of followers too

	If your twitter app don't respect these limits, it will be ban.
	You can fixed parameters allowing to "slowdown" this bot
	- CMAX is the number max of tweets retweeted by the bot during DURATION in seconds
	- MAXFRIENDS is the the number max of friends <- If this number is reached, bot will stop

	By default, CMAX = 5, DURATION = 180 (matches to 50 tweets by 1/2 hour) and MAXFRIENDS is 1995.
 	It would be unwise to set MAXFRIENDS to 2000. 
	If the last tweet retweeted includes a lot of users mentions, your number of friends could exceeds 2000.

	Also, By default, this bot allows to consider "lottery draw" tweets in french (Follow+RT to have a chance to win).
	Like explained above, you can change these parameters with TAGS and LANG.

