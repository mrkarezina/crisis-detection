import pymongo
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
import tweepy
import time

from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
from google.oauth2 import service_account

client = pymongo.MongoClient(
    "mongodb+srv://mrkarezina:kgIy1DznBD9dZjuu@cluster0-rmj90.gcp.mongodb.net/test?retryWrites=true&w=majority")
db = client.news_data
serverStatusResult = db.command("serverStatus")

credentials = service_account.Credentials.from_service_account_file("service_account.json")


def tweet_analysis(text):
    # Instantiates a client
    client = language.LanguageServiceClient(credentials=credentials)

    document = types.Document(
        content=text,
        type=enums.Document.Type.PLAIN_TEXT)

    # Detects the sentiment of the text
    ner = client.analyze_entity_sentiment(document).entities

    sorted(ner, key=lambda x: x.salience, reverse=True)

    return {
        "entities": [{
            "name": e.name,
            "salience": e.salience,
            "sentiment": {
                "magnitude": e.sentiment.magnitude,
                "score": e.sentiment.score
            }
        } for e in ner[:8]],
    }


def save_tweet_data(tweet, language):
    db.tweets.insert_one({
        "language": language,
        "text": tweet.text,
        "date": tweet.created_at,
        "id": tweet.id,
        "nlp": tweet_analysis(text=tweet.text)
    })

    print(f"Inserted: {tweet.text}")


# # search parameters
tweets_list = []
text_query = "coronavirus OR COVID-19"
count = 1000
# lat = 43  # coords for Toronto
# longi = 79
# radi_km = 500
# coord_rad = f"{lat},{longi},{radi_km}km"
# print(coord_rad)
#
# access keys
consumer_key = 'FyBL97wEZvFj5PrifZYKRfvb4'
consumer_secret = 'u9rkw1XrCplTZQaG6OEsMJkbaAWQp6rZwC8F4yt9LXH8Ho83Il'
access_token = '2885094292-mrGSawGwClLXhQnZJdI6SJztZuS7O8ON7ja7iLp'
access_token_secret = 'R5xXU1g20FjR0da8ErDlvhQciS0vnniFbhph5oaiCClKQ'

# instantiation of API
auth = OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)

for lang in ['ja', 'es', 'en']:
    for tweet in api.search(q=text_query, lang=lang, count=count):
        try:
            save_tweet_data(tweet, lang)
        except BaseException as e:
            print('failed on_status,', str(e))
            time.sleep(3)
