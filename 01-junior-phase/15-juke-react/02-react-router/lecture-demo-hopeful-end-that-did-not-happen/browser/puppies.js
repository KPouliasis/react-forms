import React, { Component } from 'react';
import axios from 'axios';
import NavLink from './navLink.js';

export default class Puppies extends Component {
  constructor () {
    super();
    this.state = {};
  }
  componentDidMount(){
    // We have individual state here, which is great and localized. Also, could be confusing if we don't remember that we have localized states
    axios.get('/api/puppies')
      .then(response => response.data)
      .then(puppyData => this.setState({puppyData}))
      .catch(console.error.bind(console))
  }
  render () {
    const { puppyData } = this.state; 
    return (
      <div>
        <h3>Puppies!!!</h3>
        { puppyData && puppyData.map(puppy => {
            return (
              <div key={puppy}>
                <NavLink to={`/puppies/${puppy}`}>{puppy}</ NavLink>
              </div>
            );
        }) }
      </div>
      )
  }
}