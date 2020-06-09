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


def get_recipes():
    """Return a list of all recipes."""

    return Recipe.query.all()


def get_recipe_by_name(name):
    """Return a recipe with the given name."""

    recipe = Recipe.query.filter(Recipe.name == name).one()

    return recipe


def create_material(name, is_craftable):
    """Create and return a new material."""

    material = Material(name=name, is_craftable=is_craftable)

    db.session.add(material)
    db.session.commit()

    return material


def get_materials():
    """Return a list of all materials."""

    return Material.query.all()


def get_material_by_name(name):
    """Return a material with the given name."""

    material = Material.query.filter(Material.name == name).one()

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

    db.session.add(media)
    db.session.commit()

    return media


def get_medias():
    """Return all media."""

    return Media.query.all()


def get_media_by_path(path):
    """Return a media with the given path."""

    media = Media.query.filter(Media.file_path == path).one()

    return media


def add_recipe_to_media(media, recipe):
    """Associate a media file to a recipe."""

    media.recipes.append(recipe)
    db.session.commit()


def add_material_to_media(media, material):
    """Associate a media file to a material."""

    media.materials.append(material)
    db.session.commit()


def create_category(code, name):
    """Create and return a new category."""

    category = Category(cat_code=code, name=name)

    db.session.add(category)
    db.session.commit()

    return category

def get_categories():
    """Return a list of all categories."""

    return Category.query.all()


def create_series(code, name):
    """Create and return a new series."""

    series = Series(series_code=code, name=name)

    db.session.add(series)
    db.session.commit()

    return series


if __name__ == '__main__':
    from server import app

    connect_to_db(app)