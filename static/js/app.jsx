"use strict";

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Search />
        <Display />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));