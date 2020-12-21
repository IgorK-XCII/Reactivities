import React from 'react';
import { createBrowserHistory } from 'history';
import 'react-toastify/dist/ReactToastify.min.css';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import './app/layout/styles.css';
import App from './app/layout/App';
import 'semantic-ui-css/semantic.min.css';
import ScrollToTop from './app/layout/ScrollToTop';

export const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <ScrollToTop>
      <App />
    </ScrollToTop>
  </Router>,
  document.getElementById('root'));
