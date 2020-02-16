import pymongo
from tweepy import OAuthHandler
import tweepy

from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
from google.oauth2 import service_account

from config import MONGO_CONNECTION_STRING

client = pymongo.MongoClient(MONGO_CONNECTION_STRING)
db = client.news_data

credentials = service_account.Credentials.from_service_account_file("service_account.json")


def tweet_analysis(text):
    """
    NLP analysis tweet text
    :param text:
    :return:
    """

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


def save_tweet_data(params):
    """
    Saves the tweet and
    :param params:
        - the tweet object
        - the language string: ['en', 'es', 'ja']
    :return:
    """

    tweet, language = params[0], params[1]

    db.tweets.insert_one({
        "language": language,
        "text": tweet.text,
        "date": tweet.created_at,
        "id": tweet.id,
        "link": tweet.url,
        "nlp": tweet_analysis(text=tweet.text)
    })

    print(f"Inserted: {tweet.text}")


# search parameters
tweets_list = []
# text_query = "coronavirus OR COVID-19"
text_query = "\"via rail\""
count = 1000

# access keys
consumer_key = 'FyBL97wEZvFj5PrifZYKRfvb4'
consumer_secret = 'u9rkw1XrCplTZQaG6OEsMJkbaAWQp6rZwC8F4yt9LXH8Ho83Il'
access_token = '2885094292-mrGSawGwClLXhQnZJdI6SJztZuS7O8ON7ja7iLp'
access_token_secret = 'R5xXU1g20FjR0da8ErDlvhQciS0vnniFbhph5oaiCClKQ'

# instantiation of API
auth = OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)

# Multithreaded
from concurrent.futures import ThreadPoolExecutor, as_completed

for lang in ['en', 'es', 'ja']:

    futures = []

    # Async execution
    with ThreadPoolExecutor(max_workers=15) as executor:
        for tweet in api.search(q=text_query, lang=lang, count=count):
            futures.append(executor.submit(save_tweet_data, [tweet, lang]))
        for future in as_completed(futures):
            if future.result() is not None:
                pass
