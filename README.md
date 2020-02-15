# Crisis Detection

## Setup

Install packages: `pip install -r requirements.txt`

## Real Time News Pipeline

Real time pipeline for processing tweets and news articles. Processing pipeline to apply topic and entity extraction to tweets and news articles the saving into database.

### Twitter

[Twitter API](https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/intro-to-tweet-json)

scrape + geolocate
https://github.com/amr-amr/CrisisTweetMap/tree/master/tweet_classifier


### News Sources

Cheap news firehose ???


### NLP

Google Cloud Entity api for extracting entities. -> No disease specific NER.
AutoML for custom entity model.


Content Classification -> very broad
Topic of the Tweet?


Could also just do if there is a cluster of tweets with a certain sentiment in an area.


### Twitter Scraper

Currently using GetOldTweets3 Py Lib to scrape Tweets as currently roadblocked while
waiting for Twitter Developer account approval to create auth tokens. 

Benefits include being able to access tweets older than 7 days and having unlimited 
query rates. However, limited tweet meta-data (geo-location is buggy) is offered.
GetOldTweets3 Docs: https://github.com/Mottl/GetOldTweets3

EDIT: Twitter Dev Account approved and will implement scraping with Tweepy as well

Tweepy Docs: https://tweepy.readthedocs.io/en/latest/getting_started.html





