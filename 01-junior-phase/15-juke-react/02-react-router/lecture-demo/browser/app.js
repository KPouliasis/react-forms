import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const { puppyData } = this.props; //how do we get this data
    return (
      <div>
        <h3>Puppies!!!</h3>
        { puppyData.map(puppy => {
            return (
              <a href="#">{puppy.name}</a> //key of puppy name
            );
        }) }
      </div>
      )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);