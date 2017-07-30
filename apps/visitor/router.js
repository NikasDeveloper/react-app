import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import { RouteTransition, presets } from 'react-router-transition';

import Nav from './components/nav';
import Component1 from './components/component1';
import Component2 from './components/component2';

export const history = createHistory({ basename: '/' });

export default class Router extends React.Component {
    render() {
        return (
            <ConnectedRouter history={history}>
                <div id="container">
                    <Nav />
                    <Route render={ ({ location, history, match }) => {
                        const { action } = history;
                        const animation = action === 'PUSH' ? presets.slideLeft : presets.slideRight;

                        return (
                            <RouteTransition pathname={location.pathname} {...animation}>
                                <div style={{ position: 'absolute' }}>
                                    <Switch>
                                        <Route exact path="/component1" component={Component1} />
                                        <Route exact path="/component2" component={Component2} />
                                    </Switch>
                                </div>
                            </RouteTransition>
                        );
                    }} />
                </div>
            </ConnectedRouter>
        );
    }
}