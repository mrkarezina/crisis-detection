# Crisis Detection


## Setup

Install packages: `pip install -r requirements.txt`


## Real Time Events Pipeline

Real time pipeline for processing news articles and tweets. Processing pipeline to apply topic, sentiment, and entity extraction to tweets and news articles the saving into database.

Given keyword(s) from the user, reputable news sources are scrapped for information relevant to the keywords. Location keywords are extracted, converted into latitude/longitude coordinates, and used as search parameters for tweets in a given geolocation. The resulting tweets are then categorized through NLP and assigned a sentiment rating.


### News Sources

Scrape news articles from provided RSS sources using newspaper3k.


### Twitter 

Two versions of Tweet Scrapers have been implemented. One version uses the Tweepy library and the
other version uses GetOldTweets3. For this project, we will use the Tweepy version as it offers more
data. 

#### Tweepy
Access to Twitter's APIs using OAuth2. Limited query rate for tweets no older than 7 days old. However,
Tweepy provides a wide variety of methods to access specific details from each tweet.
[Tweepy Docs](https://tweepy.readthedocs.io/en/latest/getting_started.html)

#### GetOldTweets3 
Benefits include being able to access tweets older than 7 days and having unlimited 
query rates. However, limited tweet meta-data (geo-location is buggy) is offered.
[GetOldTweets3 Docs](https://github.com/Mottl/GetOldTweets3)


[Twitter API](https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/intro-to-tweet-json)


### NLP

For each article use the use the Google Natural Language API to:
- Identify entities and sentiment towards each entity
- Find topic of article

Ex: analyze_text("...") returns
```
{
  'entities': [
    {
      'name': 'Apple',
      'salience': 0.5572285056114197
    },
    {
      'name': 'market',
      'salience': 0.06980098783969879
    },
    {
      'name': 'iPhone',
      'salience': 0.029208600521087646
    },
    {
      'name': 'product categories',
      'salience': 0.028690919280052185
    },
    {
      'name': 'people',
      'salience': 0.024379173293709755
    },
    {
      'name': 'revenue',
      'salience': 0.012969419360160828
    },
    {
      'name': 'way',
      'salience': 0.011091737076640129
    },
    {
      'name': 'case',
      'salience': 0.010217440314590931
    },
    {
      'name': 'shift',
      'salience': 0.010174483992159367
    },
    {
      'name': 'company',
      'salience': 0.009243002161383629
    }
  ],
  'topic': '/Computers & Electronics/Consumer Electronics'
}
```


For each Tweet:
- Identify the mentioned entities and sentiment towards entities


## Future Steps

- Train custom topic classification model on crisis topics.
- Train entity extraction model for entities specific to a certain crisis. Ie: For Corona virus entity recognition for symptoms.



