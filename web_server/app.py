from flask import Flask, request
import json
from search_tweets import search

app = Flask(__name__)


@app.route('/queryTweets', methods=['POST'])
def get_clusters():
    params = json.loads(request.data)
    keyword = params["keyword"]
    end_date = params["end_date"]

    tweets = search(keyword, end_date)

    response = app.response_class(
        response=json.dumps(tweets),
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
