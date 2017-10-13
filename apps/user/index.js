import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, createApp } from 'reax-helpers';

import * as reducers from './reducers';
import Router, { history } from './router';

const development = process.env.NODE_ENV === 'development';

const store = createStore({ reducers, history, verbose: development, loggerCollapsed: true, loggerFilter: ['persist/'] });
const App = createApp({ store, Router, history, persistKeyPrefix: 'user', persistWhitelist: ['main'] });

ReactDOM.render(<App />, document.getElementById('app'));
