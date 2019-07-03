import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

import Navigation from './Components/Navigation/Navigation';
import WeightTracker from './Components/WeightTracker/WeightTracker';
import Signup from './Components/Signup/Signup';
import Signin from './Components/Signin/Signin';
import Initialise from './Components/Initialise/Initialise';
import { withRouter } from 'react-router';

import * as ROUTES from './Routes';

const RoutesFile = (props) => (
  <Router>
    {console.log(props)}
    <div>
      <Navigation userLoggedIn={props.userLoggedIn} />
      <Route exact path={ROUTES.LANDING} component={WeightTracker} />
      <Route path={ROUTES.SIGN_UP} component={Signup} />
      <Route path={ROUTES.SIGN_IN} component={Signin} />
      <Route path={ROUTES.INITIALISE} component={Initialise} />
      {/* <Route path='/' component={Signup} /> */}
      <Redirect path={ROUTES.SIGN_UP} component={Signup} />
      {/* <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
      <Route path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />  */}
    </div>
  </Router>
);

export default withRouter(RoutesFile);