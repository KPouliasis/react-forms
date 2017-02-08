import React, { Component } from 'react';
import axios from 'axios';

export default class SingleKitten extends Component {
  componentDidMount () {
    // We need to send in routeParams.name because `this` context is important
      // Notice that we can just call the function we bound and sent in from `app.js`
    this.props.getSingleKitten(this.props.routeParams.name);
  }
  render () {
    const kitten = this.props.selectedKitten;
    return (
        <div>
          {kitten ? <div>
            <h4>{kitten.name}</h4>
            <div><img src={kitten.image} /></div>
          </div> : <h3>Loading...</h3>}
        </div>
      )
  }
}