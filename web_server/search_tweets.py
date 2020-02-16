import pymongo
import search_cities
import tweepy
from tweepy import OAuthHandler

# TODO: move connection string to config
client = pymongo.MongoClient(
    "mongodb+srv://mrkarezina:kgIy1DznBD9dZjuu@cluster0-rmj90.gcp.mongodb.net/test?retryWrites=true&w=majority")
db = client["news_data"]

# access keys
consumer_key = 'FyBL97wEZvFj5PrifZYKRfvb4'
consumer_secret = 'u9rkw1XrCplTZQaG6OEsMJkbaAWQp6rZwC8F4yt9LXH8Ho83Il'
access_token = '2885094292-mrGSawGwClLXhQnZJdI6SJztZuS7O8ON7ja7iLp'
access_token_secret = 'R5xXU1g20FjR0da8ErDlvhQciS0vnniFbhph5oaiCClKQ'

# instantiation of API
auth = OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)


def search(text_query, end_date):
    """
    Query from Mongodb all tweets within date.
    Return array of clusters.
    :param text_query:
    :param end_date:
    :return:
    """

    # Search mongoDB instead
    # TODO: change to ["text"] notation if using mongodb
    # result = db.tweets.find({"language": "en", "text": {"$regex": keyword}})

    # End date format: "2020-02-10"
    # Max count 100
    result = api.search(q=text_query, lang='en', count=100, until=end_date, result_type="popular")

    tweets = []

    for res in result:
        try:
            words = res.text.split(" ")

            lat_long = {}
            for word in words:
                location = search_cities.get_lat_long(word)
                if location is not None:
                    lat_long = location
                    break
            if not ('lat' in lat_long):
                continue
            tweets.append({
                "id": res.id,
                # Convert created at date to unix timestamp
                "date": res.created_at.strftime('%s'),
                "lat": lat_long['lat'],
                "long": lat_long['long']
            })

        except Exception as e:
            print(e)

    return tweets

# print(search(text_query="coronavirus", end_date="2020-02-14"))
