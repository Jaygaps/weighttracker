import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import app from "./config";
import { useAuthState } from 'react-firebase-hooks/auth';
import Navigation from './Components/Navigation/Navigation';
import WeightTracker from './Components/WeightTracker/WeightTracker';
import Signup from './Components/Signup/Signup';
import Signin from './Components/Signin/Signin';
import Initialise from './Components/Initialise/Initialise';
import { withRouter } from 'react-router';

import * as ROUTES from './Routes';

const RoutesFile = (props) => {
  const [user, initialising, error] = useAuthState(app.auth());
  if (user) {
    return (
      <Router>
        <div>
          <Navigation userLoggedIn={user} />
          <Route exact path={ROUTES.LANDING} component={WeightTracker} />
          <Route exact path={ROUTES.INITIALISE} component={Initialise} />
          <Redirect to={ROUTES.INITIALISE} />

        </div>
    </Router>
    )
  }

  if (user && user.displayName) {
    return (
      <Router>
        <div>
          <Navigation userLoggedIn={user} />
          <Route exact path={ROUTES.LANDING} component={WeightTracker} />
          <Route exact path={ROUTES.INITIALISE} component={Initialise} />
          <Redirect to={ROUTES.LANDING} />

        </div>
    </Router>
    )
  }

  return (
    <Router>
      <div>
        <Navigation userLoggedIn={user} />
        <Switch>
          <Route path={ROUTES.SIGN_UP} component={Signup} />
          <Route path={ROUTES.SIGN_IN} component={Signin} />
          <Redirect to={ROUTES.SIGN_UP} />
        </Switch>
      </div>
  </Router>
  )
  
};

export default withRouter(RoutesFile);