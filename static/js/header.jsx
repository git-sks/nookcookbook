"use strict";

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="header-wrapper">
          <div className="row">

            <div className="col-8">
              <div className="site-name">
                NookCookBook
              </div>
            </div>

            <div className="col-4">
              <div className="header-link">
                <Link id="calc-link" to="/calculator">Calculator</Link>
              </div>
              <div className="header-link">
                <Link id="search-link" to="/">Search</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}