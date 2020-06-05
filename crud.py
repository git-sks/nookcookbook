"""CRUD operations."""

from model import db, connect_to_db, Recipe, Material, RecipeMaterial, Media, Category, Series

# Functions
def create_recipe(name, cat_code, series_code=None):
    """Create and return a new recipe."""

    recipe = Recipe(name=name, cat_code=cat_code)

    if series_code != None:
        recipe.series_code = series_code

    db.session.add(recipe)
    db.session.commit()

    return recipe


def get_recipe_by_name(name):
    """Return a recipe with the given name."""

    recipe = Recipe.query.filter(Recipe.name == name)

    return recipe


def create_material(name):
    """Create and return a new material."""

    material = Material(name=name)

    db.session.add(material)
    db.session.commit()

    return material


def create_recipe_material(recipe, material, qty):
    """Create and return a new recipe-associated material."""

    recipe_material = RecipeMaterial(recipe=recipe, material=material, qty=qty)

    db.session.add(recipe_material)
    db.session.commit()

    return recipe_material


def create_media(path, media_type):
    """Create and return a new media."""

    media = Media(file_path=path, media_type=media_type)

    db.session.add(create_media)
    db.session.commit()

    return media



def create_category(code, name):
    """Create and return a new category."""

    category = Category(cat_code=code, name=name)

    db.session.add(category)
    db.session.commit()

    return category


def create_series(code, name):
    """Create and return a new series."""

    series = Series(series_code=code, name=name)

    db.session.add(series)
    db.session.commit()

    return series