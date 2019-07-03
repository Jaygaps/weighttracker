import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import app from "./config";

import RoutesFile from './RoutesFile';

class Main extends Component {
  state = {
    userLoggedIn: null,
  }

  componentDidMount = () => {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ userLoggedIn: true });
      } else {
        this.setState({ userLoggedIn: false });
      }
    });  
  }

  render() {
    return (
        <Router>
          <RoutesFile userLoggedIn={this.state.userLoggedIn} />
        </Router>
    )
  }
}

export default Main;