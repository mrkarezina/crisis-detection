import json
import csv

f = open('worldcities.csv', encoding ="utf-8")
rows = csv.reader(f, delimiter=',')


def get_lat_long(city, country):
    for row in rows:
        # city and country
        if city == row[1] or country == row[4]:
            return {row[2], row[3]}


print(get_lat_long("Beijing", "owehfds")) #returns toronto
print(get_lat_long("eggs", "Canada")) #returns MTL
