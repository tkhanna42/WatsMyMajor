import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import logger from 'redux-logger'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App';
import './stylesheets/index.css';
import reducers from './reducers';

const middlewares = [apiMiddleware];
if (process.env.NODE_ENV !== 'production') middlewares.push(logger);


const store = createStore(
  reducers,
  applyMiddleware(...middlewares)
);

const Wrapper = () => (
  <Provider store={ store }>
    <MuiThemeProvider>
      <Router>
        <App />
      </Router>
    </MuiThemeProvider>
  </Provider>
);

ReactDOM.render(
  <Wrapper />,
  document.getElementById('root')
);
