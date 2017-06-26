import reset from './styles/reset.scss';
import fonts from './styles/fonts.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import createStore from 'react-create-store';
import createApp from 'react-create-app';

import * as reducers from './reducers';
import Router, { history } from './router';

const development = process.env.NODE_ENV == 'development';

const store = createStore({ reducers, history, verbose: development });

const App = createApp({ store, Router, history, persistWhitelist: ['auth', 'database'] });

ReactDOM.render(<App />, document.getElementById('app'));