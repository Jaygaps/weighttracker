import React, { Component } from 'react';
import app from "../../config";
import { withRouter } from "react-router";
import { NavLink } from 'react-router-dom';
import './Navigation.scss';
import * as ROUTES from '../../Routes';

class Navigation extends Component {
  signout = () => {
    app.auth().signOut()
      .then(() => {
        console.log(this.props);
      this.props.history.push("/signin")
      })
      .catch((error) => { console.log(error) })
  }
  render() {
    const { userLoggedIn } = this.props;
    console.log(userLoggedIn);
    return (
      <div className="navigation">
        <div className="heading">Weight Tracker <span> v 1.1</span></div>
        <ul>
          <li>
            {!userLoggedIn &&
              <NavLink to={ROUTES.SIGN_UP} activeClassName="active">Sign Up</NavLink>
            }
          </li>
          <li>
            {!userLoggedIn &&
              <NavLink to={ROUTES.SIGN_IN} activeClassName="active">Signin</NavLink>
            }
          </li>
          <li>
            {userLoggedIn &&
              <NavLink to={ROUTES.LANDING} activeClassName="active">Weight Tracker</NavLink>
            }
          </li>
          <li>
            {userLoggedIn &&
              <a onClick={() => this.signout()}>Signout</a>
            }
          </li>
        </ul>
      </div>
    )
  }
}


export default withRouter(Navigation);