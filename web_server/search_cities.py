import json
import csv

f = open('../worldcities.csv', encoding ="utf-8")
rows = csv.reader(f, delimiter=',')

allHits = {}

for row in rows:
    allHits[row[1]] = {
        'lat': row[2],
        'long': row[3]
    }
    allHits[row[4]] = {
        'lat': row[2],
        'long': row[3]
    }


def get_lat_long(keyword):
    # city and country
    if keyword in allHits:
        return allHits[keyword]
    return None