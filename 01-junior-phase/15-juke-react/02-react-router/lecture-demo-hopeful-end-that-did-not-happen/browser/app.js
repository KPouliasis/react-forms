import React, { Component, cloneElement } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {Router, Route, browserHistory, Link, IndexRoute} from 'react-router';
import Puppies from './puppies';
import SinglePuppy from './puppy';
import Kittens from './kittens';
import SingleKitten from './kitten';
import NavLink from './navLink';

const Home = (props) => {
  return(
    <div>
      <h3> Where should we go now? </h3>
    </div>
  )
}

class App extends Component {
  constructor() {
    super();
    this.state = { allKittens: [], selectedKitten: {} }
    this.getAllKittens = this.getAllKittens.bind(this);
    this.getSingleKitten = this.getSingleKitten.bind(this);
  }
  getAllKittens () {
    axios.get(`/api/kittens`)
      .then(response => response.data)
      .then(allKittens => { this.setState({ allKittens })})
      .catch(console.error.bind(console))
  }
  getSingleKitten (name) {
    axios.get(`/api/kittens/${name}`)
      .then(response => response.data)
      .then(selectedKitten => { this.setState({selectedKitten})})
      .catch(console.error.bind(console))
  }
  render () {
    const props = { getAllKittens: this.getAllKittens, 
      getSingleKitten: this.getSingleKitten,
      allKittens: this.state.allKittens,
      selectedKitten: this.state.selectedKitten }

    return(
      <div>
        <h1> Baby Animals </h1>
        <ul role='nav'>
          <li><NavLink to="/" onlyActiveOnIndex={true}>Home</NavLink></li>
          <li><NavLink to="/puppies">Puppies</ NavLink></li>
          <li><NavLink to="/kittens">Kittens</ NavLink></li>
        </ul>
      {this.props.children && cloneElement(this.props.children, props) }
      </div>
      )
  }
}

ReactDOM.render(
  <Router history={ browserHistory } >
    <Route path="/" component={ App } >
      <Route path="/puppies" component={ Puppies } />
      <Route path="/puppies/:name" component={ SinglePuppy } />
      <Route path="/kittens" component={ Kittens } />
      <Route path="/kittens/:name" component={ SingleKitten } />
      <Route path="/home" component={ Home } />
      <IndexRoute component={ Home } /> 
    </ Route>
  </ Router>,
  document.getElementById('app')
);
