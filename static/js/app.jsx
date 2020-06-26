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

    // calcRcps: { rcpID: {'name': recipe name, 'qty': qty to calculate }}
    this.state = {
      recipes: [],
      calcRcps: {},
      calcMats: {}
    }

    this.addMaterials = this.addMaterials.bind(this);
  }

  // callback function for Display child component
  updateDisplay = (recipes) => { 
    this.setState({ recipes: recipes });
  }

  // callback function for DisplayTile child component
  // recipe argument should be a dictionary
  // { 'id': recipe id,
  //   'name': recipe name }
  addCalcRcp = (recipe) => {
    const newCalcRcps = this.state.calcRcps;

    if (this.state.calcRcps[recipe['id']] === undefined) {
      newCalcRcps[recipe['id']] = { 'name': recipe['name'],
                                    'qty': 1 }
    }
    else {
      newCalcRcps[recipe['id']]['qty'] = newCalcRcps[recipe['id']]['qty'] + 1;
    }

    this.setState({ calcRcps: newCalcRcps });
    console.log("Recipes in calculator:" + this.state.calcRcps);
  }

  resetCalc = () => {
    this.setState({ calcRcps: {},
                    calcMats: {} });
  }

  addMaterials() {
    // go through by key each rcp in the calcRcps dict prop passed from App
    // get the rcp information from the server
    // then get the list of materials from the server response
    for (const rcpID in this.state.calcRcps) {
      fetch(`/api/recipes/${rcpID}`)
        .then(response => response.json())
        .then(data => {
          const rcp = this.state.calcRcps[rcpID];

          // for each material dictionary in the list of materials
          for (const mat of data['materials']) {
            // make a copy of the current calcMats state
            const newCalcMats = this.state.calcMats;

            //if the material isn't in the dictionary yet
            if (newCalcMats[mat['id']] === undefined) {
              // add it into the dictionary
              newCalcMats[mat['id']] = { 'name': mat['name'],
                                          'qty': mat['qty'] * rcp['qty'] }
            }
            else {
              // if the material is in the dictionary, update the qty in the
              // dictionary by the qty of material per recipe * qty of the
              // recipe in the recipe calculator
              newCalcMats[mat['id']]['qty'] = mat['qty'] * rcp['qty'];
            }

            // set the state of the current calcMats to the updated newCalcMats
            this.setState({ calcMats: newCalcMats });
          }
        });
    }
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
          <Route path="/calculator">
            <Calculator calcRcps={this.state.calcRcps}
                        calcMats={this.state.calcMats}
                        addMaterials={this.addMaterials}
                        resetCalc={this.resetCalc} />
          </Route>
          <Route path="/">
            <Search updateDisplay={this.updateDisplay} />
            <Display recipes={this.state.recipes}
                      addCalcRcp={this.addCalcRcp} />
          </Route>
        </Switch>
      </Router>
    );
  }
}


// HEADER COMPONENTS
class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Link to="/">Search</Link> <Link to="/calculator">Calculator</Link>
      </div>
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
    this.handleReset = this.handleReset.bind(this);
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

    // console.log("category is " + this.state.selectedCategory);
    // console.log("series is " + this.state.selectedSeries);
    // console.log("keywords are " + this.state.keywords);

    fetch('/api/filter_recipes' +
            `?category=${this.state.selectedCategory}`
            + `&series=${this.state.selectedSeries}`
            + `&keywords=${this.state.keywords}`)
      .then(response => response.json())
      .then(data => {
        this.props.updateDisplay(data);
      });
  }

  handleReset(e) {
    this.setState({ 
      selectedCategory: '',
      selectedSeries: '',
      keywords: ''
    });

    fetch('/api/filter_recipes')
      .then(response => response.json())
      .then(data => {
        this.props.updateDisplay(data);
      });
  }

  handleCategoryChange(e) {
    this.setState({ selectedCategory: e.target.value });
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
      <div>
        <form id="search">
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
          <button onClick={this.handleSubmit}>Search</button>
        </form>
        <button onClick={this.handleReset}>Reset</button>
      </div>
    );
  }
}


// DISPLAY COMPONENTS
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
        <DisplayTile key={recipe['recipe_id']}
                    recipe={recipe}
                    addCalcRcp={this.props.addCalcRcp} />
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
  constructor(props) {
    super(props);

    this.updateCalc = this.updateCalc.bind(this);
  }

  updateCalc(e) {
    e.preventDefault();

    this.props.addCalcRcp({ 'id': this.props.recipe.recipe_id,
                            'name': this.props.recipe.name });
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
      <div name={this.props.recipe.name}>
        <img src={imgUrl}></img>
        <br />
        <Link to={`/recipes/${this.props.recipe.recipe_id}`}>{this.props.recipe.name}</Link>
        <br />
        <button onClick={this.updateCalc}>Add to calculator</button>
      </div>
    );
  }
}


// CALCULATOR COMPONENTS
class Calculator extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.addMaterials();
  }

  // handleReset(e) {
  //   e.preventDefault();

  //   this.props.resetCalc();
  // }

  render() {
    const rcpTableRowEls = [];

    if (Object.keys(this.props.calcRcps).length === 0) {
      rcpTableRowEls.push(
        <tr>
          <td>No recipes added</td>
          <td></td>
        </tr>
      );
    }
    else {
      // go through by key each rcp in the calcRcps dict prop passed from App
      // get the name and qty from the rcp and create a table row for it
      for (const rcpID in this.props.calcRcps) {
        const rcp = this.props.calcRcps[rcpID]
        const rcpName = rcp['name'];
        const rcpQty = rcp['qty'];

        rcpTableRowEls.push(
          <tr>
            <td>{rcpName}</td>
            <td>{rcpQty}</td>
          </tr>
        );
      }
    }

    const matEls = [];

    if (Object.keys(this.props.calcMats).length === 0) {
      matEls.push(
        <li>No recipes added</li>
      );
    }
    else {
      for (const matID in this.props.calcMats) {
        const mat = this.props.calcMats[matID];

        matEls.push(
          <li>{mat['name']} x{mat['qty']}</li>
        );
      }
    }

    return (
      <div>
        <h1>Calculator</h1>
        <table>
          <thead>
            <tr>
              <th>Recipes</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {rcpTableRowEls}
          </tbody>
        </table>

        <br />
        <button onClick={this.props.resetCalc}>Reset calculator</button>

        <h4>Required Materials</h4>
        <ul>
          {matEls}
        </ul>
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
      <div>
        <h1>{this.state.name}</h1>
        <img src={imgUrl} />
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
      <div>
        <h1>{this.state.name}</h1>
        <img src={imgUrl} />
        <h3>Recipes Requiring {this.state.name}:</h3>
        {rcpEls}
      </div>
    );
  }
}


ReactDOM.render(<App />, document.getElementById("root"));