import React, { Component } from 'react';
import NavLink from './navLink.js';

export default class Kittens extends Component {
  componentDidMount(){
    this.props.getAllKittens();
  }
  render () {
    console.log()
    const kittenData = this.props.allKittens; 
    return (
      <div>
        <h3>Kittens!!!</h3>
        { kittenData && kittenData.map(kitten => {
            return (
              <div key={kitten}>
                <NavLink to={`/kittens/${kitten}`}>{kitten}</ NavLink>
              </div>
            );
        }) }
      </div>
      )
  }
}