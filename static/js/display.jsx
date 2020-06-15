"use strict";

class Display extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recipes: []
    };
  }


  componentDidMount() {
    fetch('/api/recipes')
      .then(response => response.json())
      .then(data => {
        this.setState({
          recipes: data
        });
      });
  }


  filter() {
    // Update props based on search values
  }


  render() {
    const tiles = [];

    for (const recipe of this.props.recipes) {
      tiles.push({
        <DisplayTile />
      });
    }

    return (
      <div>
        <DisplayTile />
        <DisplayTile />
        <DisplayTile />
      </div>
    );
  }
}

class DisplayTile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      name: '',
      category: '',
      series: '',
      materials: []
    };
  }

  render() {
    return (
      <div>
        <p>test</p>
      </div>
    );
  }
}