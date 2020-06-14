"use strict";

class Search extends React.Component {
  render() {
    const seriesOptions = [];

    fetch('/api/series')
      .then(response => response.json())
      .then(data => {
        for (const series of data) {
          seriesOptions.push(
            <option value={series[0]}>{series[1]}</option>
          );
        }
      });
    console.log(seriesOptions);

    return (
      <div id="search">
        <form>
          <CategoryDropdown />
          <select name="series" placeholder="+ series filter">
            {seriesOptions}
          </select>
        </form>
      </div>
    );
  }
}


class CategoryDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  render() {
    // get categories
    const categoryOptions = [];

    fetch('/api/categories')
      .then(response => response.json())
      .then(data => {
        for (const category of data) {
          categoryOptions.push(
            <option value={category[0]}>{category[1]}</option>
          );
        }
      });
    console.log(categoryOptions);

    return (
      <div>
        <select name="category"
                value={this.state.value}
                onChange={this.handleChange}
                placeholder="+ category filter">

            <option value='placeholder'>+ category filter</option>
            {categoryOptions}

        </select>
      </div>
    );
  }
}