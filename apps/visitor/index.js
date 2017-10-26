import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, createApp } from 'reax-helpers';

import { create as createJss } from 'jss';
import { JssProvider, jss } from 'react-jss';
import reset from 'jss-reset';

import * as reducers from './reducers';
import Router, { history } from './router';

const development = process.env.NODE_ENV == 'development';

const store = createStore({ reducers, history, verbose: development, loggerCollapsed: true, loggerFilter: ['persist/'] });
const App = createApp({ store, Router, history, persistKeyPrefix: 'visitor', persistWhitelist: ['main'] });

jss.createStyleSheet(reset).attach();

ReactDOM.render(<JssProvider jss={jss}><App /></JssProvider>, document.getElementById('app'));