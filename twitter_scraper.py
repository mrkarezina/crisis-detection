# getoldtweets3 library -> unlimited queries, no auth needed -> limited data
# see docs in README

import GetOldTweets3 as got
from langdetect import detect

# input parameters
query_search = 'coronavirus'
since_date = '2020-01-01'
until_date = '2020-02-14'
num_tweets = 10

# TODO: Fix the geoSpan = tweetPQ('span.Tweet-geo') tag in the Tweet Manager to get the geo data
tweetCriteria = got.manager.TweetCriteria().setQuerySearch(query_search) \
    .setSince(since_date) \
    .setUntil(until_date) \
    .setMaxTweets(num_tweets) \
    # .setTopTweets(True)

tweets = got.manager.TweetManager.getTweets(tweetCriteria)

# create list of all tweets (all languages)
all_tweets = [{
    "text": tweet.text,
    "date": "tweet.date",
    "geo-data": tweet.geo
} for tweet in tweets]

en_tweets = []

# filter out non-english tweets
for tweet in all_tweets:
    tweet_lang = detect(tweet["text"])

    if tweet_lang == 'en':
        en_tweets.append(tweet)

print(en_tweets)

# tweepy library for python scraping
# not used since roadblocked by Twitter Developer Approval wait time for auth tokens

"""
import tweepy

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)

tweets_list = []
text_query = 'Coronavirus'
count = 10

try:
# Pulling individual tweets from query
    for tweet in api.search(q=text_query, count=count):
# Adding to list that contains all tweets
      tweets.append((tweet.created_at,tweet.id,tweet.text))
except BaseException as e:
    print('failed on_status,',str(e))
    time.sleep(3)

"""
