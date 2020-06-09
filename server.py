"""Server for ACNH recipes lookup and calculator app."""

from flask import Flask, render_template, request, flash, session, redirect
from model import connect_to_db
import crud

app = Flask(__name__)
app.secret_key = "dev"


@app.route('/')
def show_homepage():
    """Show the application homepage."""

    categories = crud.get_categories()

    return render_template('index.html')


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)