"use strict";

class Display extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.recipes !== prevProps.recipes) {
      this.render();
    }
  }

  render() {
    const tiles = [];

    for (const recipe of this.props.recipes) {
      tiles.push(
        <div className="col-sm-4 col-md-3 col-lg-2">
          <DisplayTile key={recipe['recipe_id']}
                      recipe={recipe}
                      addCalcRcp={this.props.addCalcRcp} />
        </div>
      );
    }

    return (
      <div className="container">
        <div className="row">
          {tiles}
        </div>
      </div>
    );
  }
}


class DisplayTile extends React.Component {
  constructor(props) {
    super(props);

    this.updateCalc = this.updateCalc.bind(this);
  }

  updateCalc(e) {
    e.preventDefault();

    this.props.addCalcRcp({ 'id': this.props.recipe.recipe_id,
                            'name': this.props.recipe.name });

    alert(`${this.props.recipe.name} has been added to calculator`);
  }

  render() {
    let imgUrl = '';

    if (this.props.recipe.medias.length !== 0) {
      imgUrl = this.props.recipe.medias[0]["path"];
    }
    else {
      imgUrl = '/static/img/DIYRecipe.png'; //placeholder image
    }

    return (
      <div className="display-tile">
        <div name={this.props.recipe.name}>
          <img className="tile-img" src={imgUrl}></img>
          <div className="tile-name">
            <Link to={`/recipes/${this.props.recipe.recipe_id}`}>{this.props.recipe.name}</Link>
          </div>
          <div className="tile-btn">
            <button className="btn" onClick={this.updateCalc}>Add to calculator</button>
          </div>
        </div>
      </div>
    );
  }
}