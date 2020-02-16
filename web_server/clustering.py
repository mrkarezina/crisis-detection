import pymongo
import re
from random import random, choice
import geopy

cities = {
    # [N˚, W˚]
    "japan": [36.2048, 138.2529],
    "california": [36.7783, 119.4179],
    "new_york": [40.7128, 74.0060],
    "spain": [40.4637, 3.7492]
}

# Take keyword
# Find news articles with keyword / topic ...
# Find the most important entities / locations in those articles
# TODO: location??

# TODO: move connection string to config
client = pymongo.MongoClient(
    "mongodb+srv://mrkarezina:kgIy1DznBD9dZjuu@cluster0-rmj90.gcp.mongodb.net/test?retryWrites=true&w=majority")
db = client["news_data"]


def get_coordinate(lang):
    if lang == 'ja':
        return (cities["japan"][0] + 0.5 * random() - 1,
                cities["japan"][1] + random() - 1)
    elif lang == 'en':
        return (cities["california"][0] + 3 * random() - 1,
                cities["california"][1] + 10 * random() - 1)
    elif lang == 'es':
        return (cities["spain"][0] + 1 * random() - 1,
                cities["spain"][1] + 1 * random() - 1)


def cluster_tweets(keyword, start_date, end_date):
    """
    Query from Mongodb all tweets within date.
    Return array of clusters.
    :param keyword:
    :param start_date:
    :param end_date:
    :return:
    """

    # get coordinates based on language
    # randomly generate coordinates of tweets inside a country / region

    result = db.tweets.find({"language": "en"}).limit(10)
    for res in result:
        print(res["text"], type(res), f"coord {get_coordinate('en')}")

    # for tweet in db.tweets.find({"text": {"$regex": "/and/"}}):
    #     print(tweet["text"])

    clusters = [{
        "id": f"Sj2e98nSF3djfwe{random.randint(0, 10)}",
        "number_tweets": 25,
        "number_articles": 3,
        "lat": 43.6532 + random.randint(-10, 10),
        "long": 79.3832 + + random.randint(-10, 10)
    } for _ in range(20)]


cluster_tweets(1, 2, 3)
