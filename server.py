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


@app.route('/api/categories')
def get_categories():
    """Get a list of category names from the database."""

    categories = []

    cat_data = crud.get_categories()

    for entry in cat_data:
        categories.append((entry.cat_code, entry.name))

    return jsonify(categories)


@app.route('/api/series')
def get_series():
    """Get a list of series names from the database."""

    series = []

    series_data = crud.get_series()

    for entry in series_data:
        series.append((entry.series_code, entry.name))

    return jsonify(series)


@app.route('/api/series/<series_name>')
def filter_recipes_by_series(series_code):
    """Get the details of a specific series."""

    recipes = crud.get_recipes_by_series(series_code)

    return jsonify(recipes)


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)