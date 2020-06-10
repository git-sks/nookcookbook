"use strict";

class Display extends React.Component {
  render() {
    return (
      <div>
        <DisplayTile />
        <DisplayTile />
        <DisplayTile />
      </div>
    )
  }
}

class DisplayTile extends React.Component {
  render() {
    return (
      <div>
        <p>an image placeholder</p>
        <p>item name</p>
        <button>Add To Calculator</button>
      </div>
    )
  }
}