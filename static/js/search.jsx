"use strict";

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