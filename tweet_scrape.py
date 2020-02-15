#tweet scraping with Tweepy library
#finite number of queries, limited to past 7 days of tweets

from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
import tweepy


#search parameters
tweets_list = []
text_query = 'Coronavirus'
count = 3


#access keys
consumer_key = 'FyBL97wEZvFj5PrifZYKRfvb4'
consumer_secret = 'u9rkw1XrCplTZQaG6OEsMJkbaAWQp6rZwC8F4yt9LXH8Ho83Il'
access_token = '2885094292-mrGSawGwClLXhQnZJdI6SJztZuS7O8ON7ja7iLp'
access_token_secret = 'R5xXU1g20FjR0da8ErDlvhQciS0vnniFbhph5oaiCClKQ'

#instantiation of API
auth = OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)

#API requests
try:
# Pulling individual tweets from query
    for tweet in api.search(q=text_query, lang='en', count=count):
# Adding to list that contains all tweets
      tweets_list.append((tweet.created_at,tweet.id,tweet.text))
except BaseException as e:
    print('failed on_status,',str(e))
    time.sleep(3)


#output
for tweet in tweets_list:
    print(tweet + tuple('\n'))
