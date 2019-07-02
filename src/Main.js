import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import RoutesFile from './RoutesFile';

const Main = () => (
  <Router>
    <RoutesFile />
  </Router>
);

export default Main;