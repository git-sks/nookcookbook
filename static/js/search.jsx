"use strict";

class SearchForm extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div>
        <form>
          <select name="category">
            <option value="test">test</option>
          </select>
        </form>
      </div>
    );
  }
}

ReactDOM.render(<SearchForm />, document.getElementById('search'));