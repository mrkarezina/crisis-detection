# Crisis Detection


## Setup

Install packages: `pip install -r requirements.txt`

Add a `service_account.json` with permissions to call Google Natural Language API.


## Real Time Events Pipeline

Real time pipeline for processing news articles and tweets. Processing pipeline to apply topic, sentiment, and entity extraction to tweets and news articles the saving into database.

Given keyword(s) from the user, reputable news sources are scrapped for information relevant to the keywords such as related entities and topics. Location keywords are extracted, converted into latitude/longitude coordinates, and used as search parameters for tweets in a given geolocation. If specific locations not found, data was grouped into the capital of the known country.

The resulting tweets are then categorized through NLP and assigned a sentiment rating. If there is a group of tweets with a high magnitude of sentiment towards the same entity in a given geographic area (within radius) of coordinate we say the group of tweets is a cluster.

We move along the world maps in a grid like pattern for each. Calculate the average sentiment in a certain radius for each point on the grid. If the strength of the sentiment is above a certain threshold in that area we assign the tweets to a cluster.


### News Sources

Scrape news articles from provided RSS sources using newspaper3k.

### Tweepy
Access to Twitter's APIs using OAuth2. Limited query rate for tweets no older than 7 days old. However, Tweepy provides a wide variety of methods to access specific details from each tweet.
[Tweepy Docs](https://tweepy.readthedocs.io/en/latest/getting_started.html)


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


## Web Server

We have a Flask web server which can take any keywords and search for relevant tweets. The self reported location of the tweeter's user's profile is processed and turned into a long / lat pair.

Sample request:
```json
{
	"keyword": "coronavirus",
	"end_date": "2020-02-9"
}
```

Sample response:
```json
[
    {
        "id": 1226294636013998080,
        "date": "1581224399",
        "lat": "30.5800",
        "long": "114.2700"
    },
    {
        "id": 1226294633514270721,
        "date": "1581224398",
        "lat": "29.7869",
        "long": "-95.3905"
    },
    {
        "id": 1226294629353623554,
        "date": "1581224397",
        "lat": "30.5800",
        "long": "114.2700"
    },
    {
        "id": 1226294628250476545,
        "date": "1581224397",
        "lat": "33.8560",
        "long": "-112.1168"
    }
]
```


## Future Steps

- Train custom topic classification model on crisis topics.
- Train entity extraction model for entities specific to a certain crisis. Ie: For Corona virus entity recognition for symptoms.



