"use strict";

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
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h1>Calculator</h1>
            <div className="table-wrapper">
              <table className="table">
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
              <button className="btn"
                      onClick={this.props.resetCalc}>Reset calculator</button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-4">
            <h4>Required Materials</h4>
          </div>
          <div className="col-8">
            <ul>
              {matEls}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}