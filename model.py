"""Models for ACNH recipes lookup and calculator app."""

import os
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Recipe(db.Model):
    """A recipe."""

    # table name
    __tablename__ = "recipes"

    # table columns
    recipe_id = db.Column(db.Integer,
                        primary_key=True,
                        autoincrement=True,
                        nullable=False,
                        )
    name = db.Column(db.String, unique=True, nullable=False,)
    cat_code = db.Column(db.String,
                        db.ForeignKey('categories.cat_code'),
                        nullable=False,
                        )
    season_code = db.Column(db.String,
                        db.ForeignKey('seasons.season_code'),
                        )

    # relationships
    recipe_materials = db.relationship('RecipeMaterial')
    category = db.relationship('Category')
    season = db.relationship('Season')
    medias = db.relationship('Media', secondary='recipe_medias')

    def __repr__(self):
        """A human-readable summary of a recipe."""

        return (f'<Recipe recipe_id={self.recipe_id} '
                + f'name={self.name} '
                + f'cat_code={self.cat_code} '
                + f'season_code={self.season_code}>'
                )


class Material(db.Model):
    """A material."""

    # table name
    __tablename__ = "materials"

    # table columns
    material_id = db.Column(db.Integer,
                            primary_key=True,
                            autoincrement=True,
                            nullable=False,
                            )
    name = db.Column(db.String, unique=True, nullable=False,)

    # relationships
    recipes = db.relationship('Recipe', secondary='recipe_materials')
    medias = db.relationship('Media', secondary='material_medias')

    def __repr__(self):
        """Human-readable summary of a material."""

        return f'<Material material_id={self.material_id} name={self.name}>'


class RecipeMaterial(db.Model):
    """An individual material needed for a specific recipe."""

    # table name
    __tablename__ = "recipe_materials"

    # table columns
    rcpmat_id = db.Column(db.Integer,
                        primary_key=True,
                        autoincrement=True,
                        nullable=False,
                        )
    recipe_id = db.Column(db.Integer,
                        db.ForeignKey('recipes.recipe_id'),
                        nullable=False,
                        )
    material_id = db.Column(db.Integer,
                            db.ForeignKey('materials.material_id'),
                            nullable=False,
                            )
    qty = db.Column(db.Integer, nullable=False,)

    # relationships
    recipe = db.relationship('Recipe')
    material = db.relationship('Material')

    def __repr__(self):
        """Human-readable summary of a recipematerial."""

        return (f'<RecipeMaterial rcpmat_id={self.rcpmat_id} '
                + f'recipe_id={self.recipe_id} '
                + f'material_id={self.material_id} '
                + f'qty={self.qty}>'
                )


class Media(db.Model):
    """A media object."""

    # table name
    __tablename__ = "medias"

    # table columns
    media_id = db.Column(db.Integer,
                        primary_key=True,
                        autoincrement=True,
                        nullable=False,
                        )
    file_path = db.Column(db.String, nullable=False,)
    media_type = db.Column(db.String, nullable=False,)

    # relationships
    recipes = db.relationship('Recipe', secondary='recipe_medias')
    materials = db.relationship('Material', secondary='material_medias')

    def __repr__(self):
        """Human-readable summary of a media object."""

        return (f'<Media media_id={self.media_id} '
                + f'file_path={self.file_path} '
                + f'media_type={self.media_type}>'
                )


class RecipeMedia(db.Model):
    """An individual media object for a recipe."""

    # table name
    __tablename__ = "recipe_medias"

    # table columns
    rcpmed_id = db.Column(db.Integer,
                        primary_key=True,
                        autoincrement=True,
                        nullable=False,
                        )
    recipe_id = db.Column(db.Integer,
                        db.ForeignKey('recipes.recipe_id'),
                        nullable=False,
                        )
    media_id = db.Column(db.Integer,
                        db.ForeignKey('medias.media_id'),
                        nullable=False,
                        )

    def __repr__(self):
        """Human-readable summary of a recipemedia object."""

        return (f'<RecipeMedia rcpmed_id={self.rcpmed_id} '
                + f'recipe_id={self.recipe_id} '
                + f'media_id={self.media_id}>')


class MaterialMedia(db.Model):
    """An individual media object for a material."""

    # table name
    __tablename__ = "material_medias"

    # table columns
    matmed_id = db.Column(db.Integer,
                        primary_key=True,
                        autoincrement=True,
                        nullable=False,
                        )
    material_id = db.Column(db.Integer,
                            db.ForeignKey('materials.material_id'),
                            nullable=False,
                            )
    media_id = db.Column(db.Integer,
                        db.ForeignKey('medias.media_id'),
                        nullable=False,
                        )

    def __repr__(self):
        """Human-readable summary of a materialmedia object."""

        return (f'<MaterialMedia matmed_id={self.matmed_id} '
                + f'material_id={self.material_id} '
                + f'media_id={self.media_id}>')


class Category(db.Model):
    """A category."""

    # table name
    __tablename__ = "categories"

    # table columns
    cat_code = db.Column(db.String,
                        primary_key=True,
                        nullable=False,
                        )
    name = db.Column(db.String, unique=True, nullable=False,)

    # relationships
    recipes = db.relationship("Recipe")

    def __repr__(self):
        """A human-readable summary of a category."""

        return f'<Category cat_code={self.cat_code} name={self.name}>'


class Season(db.Model):
    """A season."""

    # table name
    __tablename__ = "seasons"

    # table columns
    season_code = db.Column(db.String,
                            primary_key=True,
                            nullable=False,
                            )
    name = db.Column(db.String, unique=True, nullable=False,)

    # relationships
    recipes = db.relationship("Recipe")

    def __repr__(self):
        """A human-readable summary of a season."""

        return f'<Season season_code={self.season_code} name={self.name}>'


def connect_to_db(flask_app, db_uri='postgresql:///nookcookbook', echo=True):
    """Connect to database."""

    # Set flask app configurations
    flask_app.config['SQlALCHEMY_DATABASE_URI'] = db_uri
    flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')


if __name__ == '__main__':
    from server import app

    os.system('dropdb nookcookbook')
    os.system('createdb nookcookbook')

    connect_to_db(app)
    db.create_all()
    # connect_to_db(app, echo=False) # if want turn off SQLAlchemy query echoing