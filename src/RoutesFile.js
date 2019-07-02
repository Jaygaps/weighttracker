import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

import Navigation from './Navigation';
import App from './App';
import Signup from './Signup';

import * as ROUTES from './Routes';

const RoutesFile = () => (
  <Router>
    <div>
      <Navigation />

      <hr />

      <Route exact path={ROUTES.LANDING} component={App} />
      <Route path={ROUTES.SIGN_UP} component={Signup} />
      <Redirect path={ROUTES.SIGN_UP} component={Signup} />
      {/* <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
      <Route path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />  */}
    </div>
  </Router>
);

export default RoutesFile;