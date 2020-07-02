# NookCookBook

NookCookBook is a recipe look-up and materials calculator for the Nintendo Switch game Animal Crossing: New Horizons (ACNH).

## Table of Contents
* Features
* Technology
* Installation
* Future Plans

## Features
#### Recipe Look Up
NookCookBook currently allows for recipe look up by category (item type), series, or recipe name (partial matches valid). Search results are preserved until user refreshes the site or user presses the "Reset" button on the Search/landing page. By default, all current available recipes are displayed in the search results.

#### Materials Calculator
User can add one or more recipes to the calculator from the Search page, then view the total amount of materials they will need to craft all the recipes added. Calculator contents are preserved until user refreshes the site or user presses "Reset calculator" button on the Calculator page.

#### Recipe Details
User can view recipe details by clicking on the recipe name in the search results. Recipe details page displays the recipe name, image, category, series (if applicable), and materials needed.

#### Material Details
User can view material details by clicking on a material in a recipe details page. Material details page displays the material name, image, and a list of the recipes that uses that material.

## Technology
* Python 3
* Javascript/JSX
* Flask
* SQLAlchemy
* PostgreSQL
* React
* HTML
* CSS
* Bootstrap

ACNH data is sourced from the 5/23/2020 update version of the [ACNH Spreadsheet](https://tinyurl.com/acnh-sheet).

### Installation

NookCookBook requires PostgreSQL and Python 3 to be on your machine before running.

Clone or fork the NookCookBook repo: [https://github.com/git-sks/nookcookbook](https://github.com/git-sks/nookcookbook)

Then, in your virtual environment, enter the following into your terminal:

```sh
$ pip3 install -r requirements.txt
$ createdb nookcookbook
$ python3 seed_database.py
```

This installs the other necessary dependencies and sets up the NookCookBook database.

Once everything is installed, run the app:

```sh
$ python3 server.py
```

You can now access NookCookBook by going to ```localhost:5000``` in your web browser.

## Future Plans
* Finish adding all images to database
* Add search by materials
* Add pagination to search results
* Preserve calculator contents in session until reset
* Further add responsiveness to site
* Update with ACNH summer content once data is available

