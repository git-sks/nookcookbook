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

    this.state = {
      recipes: []
    }
  }

  // callback function for Display child component
  updateDisplay = (recipes) => { 
    this.setState({ recipes: recipes });
    alert(recipes[1].name);
  }

  componentDidMount() {
    fetch('/api/recipes')
      .then(response => response.json())
      .then(data => {
        this.setState({ recipes: data });
      });
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
            <Search updateDisplay={this.updateDisplay} />
            <Display recipes={this.state.recipes} />
          </Route>
        </Switch>
      </Router>
    );
  }
}


// SEARCH COMPONENTS
class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCategory: '',
      selectedSeries: '',
      keywords: '',
      categories: [],
      series: []
    };

    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleSeriesChange = this.handleSeriesChange.bind(this);
    this.handleKeywordsChange = this.handleKeywordsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // get categories data
    fetch('/api/categories')
      .then(response => response.json())
      .then(data => {
        this.setState({ categories: data });
      });

    // get series data
    fetch('/api/series')
      .then(response => response.json())
      .then(data => {
        this.setState({ series: data });
      });
  }

  handleSubmit(e) {
    e.preventDefault();

    fetch('/api/filter_recipes', {
      method: 'get'
    })
      .then(response => response.json())
      .then(data => {
        this.props.updateDisplay(data);
      });
  }

  handleCategoryChange(e) {
    this.setState({ selectedCategory: e.target.value });
    alert(this.state.selectedCategory);
  }

  handleSeriesChange(e) {
    this.setState({ selectedSeries: e.target.value });
  }

  handleKeywordsChange(e) {
    this.setState({ keywords: e.target.value });
  }

  render() {
    // make category dropdown options
    const categoryOptions = [];

    for (const category of this.state.categories) {
      categoryOptions.push(
        <option key={category['code']}
                value={category['code']}
                name="category">

          {category['name']}

        </option>
      );
    }

    // make series dropdown options
    const seriesOptions = [];

    for (const series of this.state.series) {
      seriesOptions.push(
        <option key={series['code']}
                value={series['code']}
                name="series">

          {series['name']}

        </option>
      );
    }

    return (
      <div id="search">
        <form method="GET">
          <select name="category"
                value={this.state.selectedCategory}
                onChange={this.handleCategoryChange}>

            <option value=""
                    name="category">
              + category filter
            </option>
            {categoryOptions}

          </select>

          <select name="series" 
                  value={this.state.selectedSeries}
                  onChange={this.handleSeriesChange}>

            <option value=""
                    name="series">
              + series filter
            </option>
            {seriesOptions}

          </select>
          <br />
          <input id="keywords"
                  type="text"
                  value={this.state.keywords}
                  onChange={this.handleKeywordsChange}
                  placeholder="Search..."></input>
          <br />
          <label>Search by:</label>
          <br />

          <button onClick={this.handleSubmit}>Search</button>
        </form>
      </div>
    );
  }
}


// DISPLAY COMPONENTS
class Display extends React.Component {
  render() {
    const tiles = [];

    for (const recipe of this.props.recipes) {
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