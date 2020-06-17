"""Server for ACNH recipes lookup and calculator app."""

from flask import Flask, render_template, request, flash, session, jsonify
from model import connect_to_db

import crud

app = Flask(__name__)
app.secret_key = "dev"


@app.route('/')
def show_homepage():
    """Show the application homepage."""

    return render_template('index.html')


@app.route('/api/recipes')
def get_recipes():
    """Get a list of all the recipes."""

    rcps_data = crud.get_recipes()
    recipes = []

    for entry in rcps_data:
        recipe = {'recipe_id': entry.recipe_id,
                    'name': entry.name.title()}

        recipes.append(recipe)

    return jsonify(recipes)


@app.route('/api/filter_recipes', methods=['GET'])
def filter_recipes():
    """Get the recipes based on the filters from the search form."""

    # category = request.form.get('category')
    # series = request.form.get('series')
    # keywords = request.form.get('keywords')
    print("form" + request.get_json())

    # print(f'category is {category}')
    # print(f'series is {series}')
    # print(f'keywords are {keywords}')

    # if category != 'no-filter':
    #     rcps_category = set(crud.get_recipes_by_category)
    # else:
    #     rcps_category = set(crud.get_recipes)

    # if series != 'no-filter':
    #     rcps_series = set(crud.get_recipes_by_series)
    # else:
    #     rcps_series = set(crud.get_recipes)

    # if keywords != 'no-filter':
    #     rcps_keywords = set(crud.get_recipes_by_keywords)
    # else:
    #     rcps_keywords = set(crud.get_recipes)

    # rcps_data = rcps_keywords.intersection(rcps_category, rcps_series)
    # recipes = []

    # for entry in rcps_data:
    #     recipe = {'recipe_id': entry.recipe_id,
    #                 'name': entry.name.title()}

    #     recipes.append(recipe)

    # return jsonify(recipes)


@app.route('/api/recipes/<recipe_id>')
def get_recipe_details(recipe_id):
    """Get the recipe details for the given recipe_id."""

    rcp_data = crud.get_recipe_by_id(recipe_id)

    recipe = {'recipe_id': rcp_data.recipe_id,
                'name': rcp_data.name.title(),
                'category': rcp_data.category.name}

    if rcp_data.series != None:
        recipe['series'] = rcp_data.series.name
    else:
        recipe['series'] = ''

    materials = []

    for rcpmat in rcp_data.recipe_materials:
        materials.append({'id': rcpmat.material_id,
                            'name': rcpmat.material.name.title(),
                            'qty': rcpmat.qty})

    recipe['materials'] = materials

    return jsonify(recipe)


@app.route('/api/materials/<material_id>')
def get_material_details(material_id):
    """Get the material details for the given material_id."""

    mat_data = crud.get_material_by_id(material_id)

    material = {'mat_id': mat_data.material_id,
                'name': mat_data.name.title(),
                'is_craftable': mat_data.is_craftable}

    recipes = []

    for recipe in mat_data.recipes:
        recipes.append({'id': recipe.recipe_id,
                        'name': recipe.name.title()})

    material['recipes'] = recipes

    return jsonify(material)


@app.route('/api/categories')
def get_categories():
    """Get a list of category names from the database."""

    categories = []

    cat_data = crud.get_categories()

    for entry in cat_data:
        categories.append({'code': entry.cat_code,
                            'name': entry.name})

    return jsonify(categories)


@app.route('/api/series')
def get_series():
    """Get a list of series names from the database."""

    series = []

    series_data = crud.get_series()

    for entry in series_data:
        series.append({'code': entry.series_code,
                        'name': entry.name})

    return jsonify(series)


@app.route('/api/series/<series_name>')
def filter_recipes_by_series(series_code):
    """Get the details of a specific series."""

    recipes = crud.get_recipes_by_series(series_code)

    return jsonify(recipes)


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)