import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import { ThemeProvider } from 'react-jss'

import theme from './theme';
import Layout from './components/layout';
import Home from './components/home';
import List from './components/list';

export const history = createHistory({ basename: window.cordova ? '/' : '/user' });

export default class Router extends React.Component {
    render() {
        return (
            <ConnectedRouter history={history}>
                <ThemeProvider theme={theme}>
                    <Switch>
                        <Layout>
                            <Route exact path="/" component={Home} />
                            <Route exact path="/list" component={List} />
                        </Layout>
                    </Switch>
                </ThemeProvider>
            </ConnectedRouter>
        );
    }
}