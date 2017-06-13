import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import Component1 from './components/component1';
import Component2 from './components/component2';

export const history = createHistory({ basename: '/user' });

export default class Router extends React.Component {
    render() {
        return (
            <ConnectedRouter history={history}>
                <Switch>
                    <Route exact path="/component1" component={Component1} />
                    <Route exact path="/component2" component={Component2} />
                    <Route exact path="*" component={Component1} />
                </Switch>
            </ConnectedRouter>
        );
    }
}