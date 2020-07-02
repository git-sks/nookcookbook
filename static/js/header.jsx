"use strict";

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container-fluid sticky-top">
        <div className="header-wrapper">
          <div className="row">

            <div className="col-12 col-sm-6 col-md-7 col-lg-8 col-xl-9">
              <Link className="site-name" to="/">NookCookBook</Link>
            </div>

            <div className="col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3 align-self-end">
              <div className="header-link">
                <Link id="search-link" to="/">Search</Link>
              </div>
              <div className="header-link">
                <Link id="calc-link" to="/calculator">Calculator</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}