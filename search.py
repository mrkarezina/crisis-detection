import json
import csv

f = open('worldcities.csv')
rows = csv.reader(f, delimiter=',')


def get_lat_long(city, country):
    for row in rows:
        # city and country
        if city == row[1] or country == row[4]:
            return {row[2], row[3]}


print(get_lat_long("Ottawa", "owehfds"))
print(get_lat_long("123", "Canada"))
