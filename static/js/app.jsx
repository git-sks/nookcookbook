"use strict";

const Router = window.ReactRouterDOM.BrowserRouter;
const Route = window.ReactRouterDOM.Route;
const Link = window.ReactRouterDOM.Link;
const Prompt = window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;
const useLocation = window.ReactRouterDOM.useLocation;
const useRouteMatch = window.ReactRouterDOM.useRouteMatch;


class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Header />

        <Switch>
          <Route path="/recipes/:id" component={Recipe} >
          </Route>
          <Route path="/materials/:id" component={Material} >
          </Route>
          <Route path="/">
            <Search />
            <Display />
          </Route>
        </Switch>
      </Router>
    );
  }
}


// SEARCH COMPONENTS
class Search extends React.Component {
  render() {
    const seriesOptions = [];

    fetch('/api/series')
      .then(response => response.json())
      .then(data => {
        for (const series of data) {
          seriesOptions.push(
            <option value={series[0]}>{series[1]}</option>
          );
        }
      });
    console.log(seriesOptions);

    return (
      <div id="search">
        <form>
          <CategoryDropdown />
          <select name="series" placeholder="+ series filter">
            {seriesOptions}
          </select>
          <input placeholder="Search..."></input>
          <button>Search</button>
        </form>
      </div>
    );
  }
}


class CategoryDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  render() {
    // get categories
    const categoryOptions = [];

    fetch('/api/categories')
      .then(response => response.json())
      .then(data => {
        for (const category of data) {
          categoryOptions.push(
            <option value={category[0]}>{category[1]}</option>
          );
        }
      });
    console.log(categoryOptions);

    return (
      <div>
        <select name="category"
                value={this.state.value}
                onChange={this.handleChange}
                placeholder="+ category filter">

            <option value='placeholder'>+ category filter</option>
            {categoryOptions}

        </select>
      </div>
    );
  }
}


// DISPLAY COMPONENTS
class Display extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recipes: []
    };
  }

  componentDidMount() {
    fetch('/api/recipes')
      .then(response => response.json())
      .then(data => {
        this.setState({
          recipes: data
        });
      });
  }

  filter() {
    // Update props based on search values
  }

  render() {
    const tiles = [];

    for (const recipe of this.state.recipes) {
      tiles.push(
        <DisplayTile key={recipe['recipe_id']}
                    recipe_id={recipe['recipe_id']}
                    name={recipe['name']} />
      );
    }

    return (
      <div>
        {tiles}
      </div>
    );
  }
}


class DisplayTile extends React.Component {
  render() {
    return (
      <div name={this.props.name}>
        <Link to={`/recipes/${this.props.recipe_id}`}>{this.props.name}</Link>
        <p>Add to calculator</p>
      </div>
    );
  }
}


// RECIPE COMPONENTS
class Recipe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      category: '',
      series: '',
      materials: []
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
          materials: data['materials']
        });
      });
  }

  render() {
    const seriesEls = []
    const matEls = []

    if (this.state.series !== '') {
      seriesEls.push(
        <div>
          <h3>Series</h3>
          <p>{this.state.series}</p>
        </div>);
    }

    for (const material of this.state.materials) {
      matEls.push(
        <li><Link to={`/materials/${material['id']}`}>{material['name']}</Link> x{material['qty']}</li>
      );
    }

    return (
      <div>
        <h1>{this.state.name}</h1>
        <img src="/static/img/Apple.png" />
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


// MATERIAL COMPONENTS
class Material extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      recipes: [],
      is_craftable: false
    };
  }

  componentDidMount() {
    fetch('/api/materials/' + this.props.match.params.id)
      .then(response => response.json())
      .then(data => {
        this.setState({
          name: data['name'],
          recipes: data['recipes'],
          is_craftable: data['is_craftable']
        });
      });
  }

  render() {
    const rcpEls = []

    for (const recipe of this.state.recipes) {
      rcpEls.push(
          <li><Link to={`/recipes/${recipe['id']}`}>{recipe['name']}</Link></li>
      );
    }

    return (
      <div>
        <h1>{this.state.name}</h1>
        <img src="/static/img/Apple.png" />
        <h3>Recipes Requiring {this.state.name}:</h3>
        {rcpEls}
      </div>
    );
  }
}


ReactDOM.render(<App />, document.getElementById("root"));