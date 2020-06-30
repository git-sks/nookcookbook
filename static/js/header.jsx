"use strict";

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        NookCookBook <Link to="/">Search</Link> <Link to="/calculator">Calculator</Link>
      </div>
    );
  }
}