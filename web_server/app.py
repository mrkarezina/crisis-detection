from flask import Flask, request
import json
import random

app = Flask(__name__)


@app.route('/getClusters', methods=['POST'])
def get_clusters():
    # Get the keyword and news + time range
    # Query the article with the keyword -> get it's entities and locations
    # Find tweets with those entities. Stemming and lemmatization to improve matching with Word2vec for words.
    # See if there is a geographic region with a lot of sentiment towards the topic

    # Mongodb
    # Move along the grid, calculate the average sentiment in that radius
    # If above threshold give it a cluster -> put into cache

    # Return clusters

    clusters = [{
        "id": f"Sj2e98nSF3djfwe{random.randint(0, 10)}",
        "number_tweets": 25,
        "number_articles": 3,
        "lat": 43.6532 + random.randint(-10, 10),
        "long": 79.3832 + + random.randint(-10, 10)
    } for _ in range(20)]

    # print(json.dumps(related_articles, indent=2))
    response = app.response_class(
        response=json.dumps(clusters),
        status=200,
        mimetype='application/json'
    )

    return response


@app.route('/cluster/<string:cluster>/', methods=['GET'])
def cluster_info(cluster):
    print(cluster)

    cluster = {
        "tweets": [{
            "date": "02-10-2020",
            "id": 1228804298936659974,
            "coordinates": {
                "long": 43.6532,
                "lat": 79.3832
            },
            "text": "RT @COVID_19NEWS: #coronavirus latest:\n- Confirmed infections in China increased by 5,093 overnight, bringing the nation’s total to 63,932"
        }],
        "articles": [{
            "title": "China Blah Blah",
            "date": "02-10-2020",
            "text": "RT @COVID_19NEWS: #coronavirus latest:\n- Confirmed infections in China increased by 5,093 overnight, bringing the nation’s total to 63,932"
        }]
    }

    response = app.response_class(
        response=json.dumps(cluster),
        status=200,
        mimetype='application/json'
    )

    return response


@app.after_request
def after_request(response):
    # Handle CORS for web app

    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


# ----------------------------------------------------------------------------#
# Launch.
# ----------------------------------------------------------------------------#

if __name__ == '__main__':
    app.run(debug=True)
