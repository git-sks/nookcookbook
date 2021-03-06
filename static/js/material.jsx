"use strict";

class Material extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      recipes: [],
      is_craftable: false,
      medias: []
    };
  }

  componentDidMount() {
    fetch('/api/materials/' + this.props.match.params.id)
      .then(response => response.json())
      .then(data => {
        this.setState({
          name: data['name'],
          recipes: data['recipes'],
          is_craftable: data['is_craftable'],
          medias: data['medias']
        });
      });
  }

  render() {
    const rcpEls = [];

    for (const recipe of this.state.recipes) {
      rcpEls.push(
          <li><Link to={`/recipes/${recipe['id']}`}>{recipe['name']}</Link></li>
      );
    }

    let imgUrl = '';

    if (this.state.medias.length !== 0) {
      imgUrl = this.state.medias[0]["path"];
    }
    else {
      imgUrl = '/static/img/DIYRecipe.png'; //placeholder image
    }

    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-5">
            <h1>{this.state.name}</h1>
            <img className="detail-img" src={imgUrl} />
          </div>
          <div className="col-5 align-self-center">
            <div className="detail-col">
              <h3>Recipes Requiring {this.state.name}:</h3>
              {rcpEls}
            </div>
          </div>
        </div>
      </div>
    );
  }
}