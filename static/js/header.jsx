"use strict";

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="header-wrapper">
        <div className="site-name">
          NookCookBook
        </div>
        <div className="header-link">
          <Link id="calc-link" to="/calculator">Calculator</Link>
        </div>
        <div className="header-link">
          <Link id="search-link" to="/">Search</Link>
        </div>
      </div>
    );
  }
}