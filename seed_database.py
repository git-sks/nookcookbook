"""Seed database script."""

import os
import json

import crud
import model
import server


# script begin

# reset database
os.system('dropdb ratings')
os.system('createdb ratings')

model.connect_to_db(server.app)
model.db.create_all()


# seed categories table
## get categories data from file
with open('data/categories.json') as f:
    cat_data = json.loads(f.read())

for entry in cat_data:
    category = crud.create_category(entry['cat_code'], entry['name'])


# seed series table
## get series data from file
with open('data/series.json') as f:
    series_data = json.loads(f.read())

for entry in series_data:
    series = crud.create_series(entry['series_code'], entry['name'])


# seed recipes table
## get recipes data from file
with open('data/recipes.json') as f:
    recipes_data = json.loads(f.read())

for entry in recipes_data:
    series_code = entry.get('series_code', None)

    recipe = crud.create_recipe(entry['name'], entry['cat_code'], series_code)

