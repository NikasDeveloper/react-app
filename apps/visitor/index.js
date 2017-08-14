import React from 'react';
import ReactDOM from 'react-dom';
import createStore from 'react-create-store';
import createApp from 'react-create-app';

import { create as createJss } from 'jss';
import { JssProvider, jss } from 'react-jss';
import reset from '@damianobarbati/jss-reset';

import * as reducers from './reducers';
import Router, { history } from './router';

const development = process.env.NODE_ENV == 'development';

const store = createStore({ reducers, history, verbose: development });
const App = createApp({ store, Router, history, persistWhitelist: ['auth', 'database'] });

jss.createStyleSheet(reset).attach();

ReactDOM.render(<JssProvider jss={jss}><App /></JssProvider>, document.getElementById('app'));