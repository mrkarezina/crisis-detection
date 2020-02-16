#tweet scraping with Tweepy library
#finite number of queries, limited to past 7 days of tweets

from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
import tweepy
import time

from pymongo import MongoClient
from pprint import pprint

client = MongoClient("mongodb://Allen:allenpassword@crisismap-shard-00-00-x3wme.gcp.mongodb.net:27017,crisismap-shard-00-01-x3wme.gcp.mongodb.net:27017,crisismap-shard-00-02-x3wme.gcp.mongodb.net:27017/test?ssl=true&replicaSet=CrisisMap-shard-0&authSource=admin&retryWrites=true&w=majority")
db=client.admin

serverStatusResult=db.command("serverStatus")
pprint(serverStatusResult)

#search parameters
tweets_list = []
text_query = 'Coronavirus'
count = 3
lat = 43.6532 #coords for Toronto
longi = 79.3832
radi_km = 50
coord_rad = f"{lat},{longi},{radi_km}km"

print(coord_rad)

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
      tweets_list.append((tweet.created_at,tweet.id, tweet.coordinates, tweet.text))
except BaseException as e:
    print('failed on_status,',str(e))
    time.sleep(3)


#output
print(tweets_list)

for tweet in tweets_list:
    print(tweet + tuple('\n'))
