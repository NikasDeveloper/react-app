import Perf from 'react-addons-perf';
import React from 'react';
import ReactDOM from 'react-dom';
import createStore from 'react-create-store';
import createApp from 'react-create-app';

import * as reducers from './reducers';
import Router, { history } from './router';

import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const development = process.env.NODE_ENV === 'development';

if(development) {
    window.Perf = Perf;
    window.Perf.start();
}

const store = createStore({ reducers, history, verbose: development, loggerCollapsed: true });
const App = createApp({ store, Router, history, persistWhitelist: ['auth', 'database'] });

ReactDOM.render(<App />, document.getElementById('app'));