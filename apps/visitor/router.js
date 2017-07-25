import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import { RouteTransition } from 'react-router-transition';

import Nav from './components/nav';
import Component1 from './components/component1';
import Component2 from './components/component2';

export const history = createHistory({ basename: '/' });

export default class Router extends React.Component {
    render() {
        const fade = {
            atEnter: { opacity: 0 },
            atActive: { opacity: 1 },
            atLeave: { opacity: 0 },
        };

        const slideLeft = {
            atEnter: { translateX: 100 },
            atActive: { translateX: 0 },
            atLeave: { translateX: -100 },
            mapStyles: styles => ({ transform: `translateX(${styles.translateX}%)` }),
        };

        const slideRight = {
            atEnter: { translateX: 100 },
            atActive: { translateX: 0 },
            atLeave: { translateX: 100 },
            mapStyles: styles => ({ transform: `translateX(${styles.translateX}%)` }),
        };

        return (
            <ConnectedRouter history={history}>
                <div id="container">
                    <Nav />
                    <Route render={ ({ location, history, match }) => {
                        const { action } = history;
                        const animation = action === 'PUSH' ? slideLeft : slideRight;
                        console.log(action);

                        return (
                            <RouteTransition pathname={location.pathname} {...animation}>
                                <Switch>
                                    <Route exact path="/component1" component={Component1} />
                                    <Route exact path="/component2" component={Component2} />
                                </Switch>
                            </RouteTransition>
                        );
                    }} />
                </div>
            </ConnectedRouter>
        );
    }
}