import newspaper
from article_downloader import Article

# Imports the Google Cloud client library
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
from google.oauth2 import service_account

credentials = service_account.Credentials.from_service_account_file("service_account.json")
retry_article_parse_tokens = 100


# Newspaper 3k for scraping the articles
# Google Cloud SDK for NLP analysis
# Find entities and locations from the article
# Convert locations to lat / long


def download(url, clean_doc=True):
    """
    Tries to download + parse the article using newspaper
    :param url:
    :return:
    """

    article = Article(url)
    is_valid = True

    try:
        article.download()
        article.parse(clean_doc=clean_doc)
    except newspaper.article.ArticleException:
        print("Download error")
        is_valid = False

    return article, is_valid


def fetch_article(url):
    """
    Downloads the article from URL
    :param url:
    :return:
    """

    article, is_valid = download(url)

    if is_valid:

        # Retry downloading article without cleaning
        if len(article.text.split()) < retry_article_parse_tokens:
            article, is_valid = download(url, clean_doc=False)

        title = article.title
        text = article.text
        date = article.publish_date
        img = article.top_image

        return {
            'text': text,
            'title': title,
            'date': str(date),
            'img_url': img,
            'url': url,
        }


def analyze_entities(text):
    """
    Analyzes the entities and topics
    :param text:
    :return:
    """

    # Instantiates a client
    client = language.LanguageServiceClient(credentials=credentials)

    document = types.Document(
        content=text,
        type=enums.Document.Type.PLAIN_TEXT)

    # Detects the sentiment of the text
    ner = client.analyze_entities(document)
    categories = client.classify_text(document).categories

    return {
        "entities": [{
            "name": e.name,
            "salience": e.salience,
        } for e in ner.entities],

        "topic": categories[0].name
    }


# def long_lat():



# Test
a = fetch_article('https://techcrunch.com/2019/02/18/apple-could-be-looking-for-its-next-big-revenue-model')
print(analyze_entities(a["text"]))
