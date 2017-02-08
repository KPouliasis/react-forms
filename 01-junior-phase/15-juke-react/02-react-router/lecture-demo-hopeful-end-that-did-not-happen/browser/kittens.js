import React, { Component } from 'react';
// NavLink is just a wrapper on Link that I made
import NavLink from './navLink.js';

export default class Kittens extends Component {
  componentDidMount(){
    // We call the function we bound and sent in from `app.js`
    this.props.getAllKittens();
  }
  render () {
    console.log()
    const kittenData = this.props.allKittens; 
    return (
      <div>
        <h3>Kittens!!!</h3>
        {/* && means that if the first expression is evaluated to falsey, we will NOT run the second expression. If it is truthy we will evaluate the second expression */}
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