# Crisis Detection

## Setup

Install packages: `pip install -r requirements.txt`

## Real Time News Pipeline

Real time pipeline for processing tweets and news articles. Processing pipeline to apply topic, sentiment, and entity extraction to tweets and news articles the saving into database.

### Twitter

[Twitter API](https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/intro-to-tweet-json)

scrape + geolocate
https://github.com/amr-amr/CrisisTweetMap/tree/master/tweet_classifier


### News Sources

Scrape news articles from provided RSS sources using newspaper3k.


### NLP

For each article use the use the Google Natural Language API to:
- Identify entities and sentiment towards each entity
- Find topic of article

For each Tweet:
- Identify the mentioned entities and sentiment towards entities


### Twitter Scraper

Currently using GetOldTweets3 Py Lib to scrape Tweets as currently roadblocked while
waiting for Twitter Developer account approval to create auth tokens. 

Benefits include being able to access tweets older than 7 days and having unlimited 
query rates. However, limited tweet meta-data (geo-location is buggy) is offered.
GetOldTweets3 Docs: https://github.com/Mottl/GetOldTweets3

EDIT: Twitter Dev Account approved and will implement scraping with Tweepy as well

Tweepy Docs: https://tweepy.readthedocs.io/en/latest/getting_started.html


## Future Steps
- Train custom topic classification model on crisis topics.
- Train entity extraction model for entities specific to a certain crisis. Ie: For Corona virus entity recognition for symptoms.



