import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Home extends Component {
  render() {
    return (
        <><Redirect to='/documentation' /></>
    )
  }
}

export default Home;