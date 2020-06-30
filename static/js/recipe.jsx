"use strict";

class Recipe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      category: '',
      series: '',
      materials: [],
      medias: []
    };
  }

  componentDidMount() {
    fetch('/api/recipes/' + this.props.match.params.id)
      .then(response => response.json())
      .then(data => {
        this.setState({
          name: data['name'],
          category: data['category'],
          series: data['series'],
          materials: data['materials'],
          medias: data['medias']
        });
      });
  }

  render() {
    const seriesEls = [];
    const matEls = [];

    if (this.state.series !== '') {
      seriesEls.push(
        <div>
          <h3>Series</h3>
          <p>{this.state.series}</p>
        </div>);
    }

    for (const material of this.state.materials) {
      matEls.push(
        <li><Link key={material['id']} to={`/materials/${material['id']}`}>{material['name']}</Link> x{material['qty']}</li>
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
      <div className="recipe">
        <h1>{this.state.name}</h1>
        <div className="imgUrl">
          <img src={imgUrl} />
        </div>
        <h3>Category</h3>
        <p>{this.state.category}</p>
        {seriesEls}
        <h3>Materials Required</h3>
        <ul>
          {matEls}
        </ul>
      </div>
    );
  }
}