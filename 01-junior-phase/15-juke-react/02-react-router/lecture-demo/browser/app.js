import React, { Component, cloneElement } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {Route, Router, browserHistory, Link, IndexRedirect} from 'react-router';

class Home extends Component {
  constructor () {
    super();
    this.state={name: 'hallelujah'};

    this.getAllDemPuppies = this.getAllDemPuppies.bind(this);
  }
  getAllDemPuppies () {
    axios.get("/api/puppies")
    .then(response => response.data)
    .then(puppyData => this.setState({puppyData}))
    
  }
  render () {
    return (
      <div> Baby Animales 
      {this.props.children && cloneElement(this.props.children, {
        getAllDemPuppies: this.getAllDemPuppies,
        puppyData: this.state.puppyData
      })}
      </div>
      )
  }
}

class Puppies extends Component {
  componentDidMount () {
    this.props.getAllDemPuppies();
  }
  render () {
    const puppyData = this.props.puppyData; 
    return (
      <div>
        <h3>Puppies!!!</h3>
        { puppyData && puppyData.map(puppy => {
            return (
              <div key={puppy}>
                <Link to={`/puppy/${puppy}`}>{puppy}</Link>
              </div>
            );
        }) }
        {this.props.children}
      </div>
      )
  }
}

class SinglePuppy extends Component {
  constructor () {
    super();
    this.state={};
  }
  componentDidMount () {
    axios.get(`/api/puppies/${this.props.params.puppyName}`) 
      .then(res => res.data)
      .then(selectedPuppy => this.setState({selectedPuppy}))
  }
  render () {
    const selectedPuppy = this.state.selectedPuppy
    return (
      <div>
          {selectedPuppy ? <div>
            <h4>{selectedPuppy.name}</h4>
            <div><img src={selectedPuppy.image} /></div>
          </div> : <h3>Loading...</h3>}
        </div>
      )
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Home}>
      <Route path="/puppies" component={Puppies}>
        <Route path="/puppies/:puppyName" component={SinglePuppy} />
      </Route>
      <IndexRedirect to="/puppies" />
    </Route>
  </ Router>,
  document.getElementById('app')
);








