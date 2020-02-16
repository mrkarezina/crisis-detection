import pymongo
import re
import random
import geopy
import secrets
import search 

cities = {
    # [N˚, W˚]
    "japan": [36.2048, 138.2529],
    "california": [36.7783, 119.4179],
    "new_york": [40.7128, 74.0060],
    "spain": [40.4637, 3.7492]
}

# TODO: move connection string to config
client = pymongo.MongoClient(
    "mongodb+srv://mrkarezina:kgIy1DznBD9dZjuu@cluster0-rmj90.gcp.mongodb.net/test?retryWrites=true&w=majority")
db = client["news_data"]


def get_coordinate(lang):
    if lang == 'ja':
        return (cities["japan"][0] + 0.5 * random.random() - 1,
                cities["japan"][1] + random.random() - 1)
    elif lang == 'en':
        return (cities["california"][0] + 3 * random.random() - 1,
                cities["california"][1] + 10 * random.random() - 1)
    elif lang == 'es':
        return (cities["spain"][0] + 1 * random.random() - 1,
                cities["spain"][1] + 1 * random.random() - 1)


def cluster_tweets(keyword, start_date, end_date, cache):
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
    #
    clusters = []

    result = db.tweets.find({"language": "en", "text": {"$regex": keyword}}).limit(1000)

    for res in result:
        key = secrets.token_hex(nbytes=16)
        words = res.text.split(" ")
        
        lat_long = {}
        for word in words:
            if search.get_lat_long(word) is not None:
                lat_long = search.get_lat_long(word)
                break
        if not ('lat' in lat_long):
            continue
        #coordinates = search.get_lat_long()
        clusters.append({
            "id": key,
            "number_tweets": 25,
            "date": res.date,
            "number_articles": 3,
            "lat": lat_long['lat'],
            "long": lat_long['long']
        })

        cache[key] = [res]


a = {}
cluster_tweets("via rail", 2, 3, a)
print(a)
