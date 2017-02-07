import React, { Component } from 'react';
import axios from 'axios';

export default class SingleKitten extends Component {
  componentDidMount () {
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