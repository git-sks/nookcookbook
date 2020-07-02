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

    // instantiate a new calcMats list to track materials
    const newCalcMats = [];

    for (const rcpID in this.state.calcRcps) {
      fetch(`/api/recipes/${rcpID}`)
        .then(response => response.json())
        .then(data => {
          const rcp = this.state.calcRcps[rcpID];

          // for each material dictionary in the list of materials
          for (const mat of data['materials']) {

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
              newCalcMats[mat['id']]['qty'] = newCalcMats[mat['id']]['qty'] + mat['qty'] * rcp['qty'];
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


ReactDOM.render(<App />, document.getElementById("root"));