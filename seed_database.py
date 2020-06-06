"""Seed database script."""

import os
import json

import crud
import model
import server


# script begin

# reset database
os.system('dropdb nookcookbook')
os.system('createdb nookcookbook')

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


# seed materials table
## get materials data from file
with open('data/materials.json') as f:
    mat_data = json.loads(f.read())

    for entry in mat_data:
        material = crud.create_material(entry['name'], entry['is_craftable'])


# seed recipe_materials table
## get recipematerials data from file
with open('data/recipematerials.json') as f:
    rcpmat_data = json.loads(f.read())

    for entry in rcpmat_data:
        rcpmat_recipe = crud.get_recipe_by_name(entry['recipe'])
        rcpmat_material = crud.get_material_by_name(entry['material'])
        rcpmat = crud.create_recipe_material(rcpmat_recipe,
                                            rcpmat_material, 
                                            entry['qty'])

# seed medias table
## get medias data from file
with open('data/medias.json') as f:
    medias_data = json.loads(f.read())

    for entry in medias_data:
        media = crud.create_media(entry['file_path'], entry['media_type'])


# associate medias with recipes/materials
## get media associations from file
with open('data/media_assocs.json') as f:
    assocs_data = json.loads(f.read())

    for entry in assocs_data:
        media = crud.get_media_by_path(entry['media_path'])
        rcp_data = entry.get('recipes', None)
        mat_data = entry.get('materials', None)

        if rcp_data != None:
            rcp_data = rcp_data.split(',')
            for rcp_name in rcp_data:
                recipe = crud.get_recipe_by_name(rcp_name)
                crud.add_recipe_to_media(media, recipe)

        if mat_data != None:
            mat_data = mat_data.split(',')
            for mat_name in mat_data:
                material = crud.get_material_by_name(mat_name)
                crud.add_material_to_media(media, material)