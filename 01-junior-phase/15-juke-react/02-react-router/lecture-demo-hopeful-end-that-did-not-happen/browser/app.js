import React, { Component, cloneElement } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {Router, Route, browserHistory, Link, IndexRoute} from 'react-router';
import Puppies from './puppies';
import SinglePuppy from './puppy';
import Kittens from './kittens';
import SingleKitten from './kitten';
import NavLink from './navLink';

// dumb component that will be my default view
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
    // Showing a good way of having state on a container (vs how I have puppies which has state on each component)
      // This helps us as programmers to know the state of the application all in one space. Like a table of contents
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
    // making an object to cleanly clone everything when I get to `cloneElement`
    const props = { getAllKittens: this.getAllKittens, 
      getSingleKitten: this.getSingleKitten,
      allKittens: this.state.allKittens,
      selectedKitten: this.state.selectedKitten }

    return(
      <div>
        <h1> Baby Animals </h1>
        <ul role='nav'>
          {/* NavLink is just a wrapper I made over Link to dry out my code for styling of active links
          onlyActiveOnIndex means "active" when we're at the index route (which we define in the Router)
           */}
          <li><NavLink to="/" onlyActiveOnIndex={true}>Home</NavLink></li>
          <li><NavLink to="/puppies">Puppies</ NavLink></li>
          <li><NavLink to="/kittens">Kittens</ NavLink></li>
        </ul>
      {/* this.props.children represents any children of this component (read: nested components) 
        cloneElement takes all of the properties and methods from the second parameter and shallowly copies them onto the first parameter. This means any child will have all of the properties and methods from the second object on their `this.props`
      */}
      {this.props.children && cloneElement(this.props.children, props) }
      </div>
      )
  }
}
// IndexRoute displays some UI view when no children path's match.
  // It is similar to IndexRedirect, but IndexRedirect changes the URL (redirects to an existing Route) 
// Different nestings will give different views
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
