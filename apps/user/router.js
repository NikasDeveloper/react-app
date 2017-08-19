import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import { ThemeProvider } from 'react-jss';

import theme from './theme';
import Layout from './components/layout';
import Home from './components/home';
import List from './components/list';

export const history = createHistory({ basename: window.cordova ? '/' : '/user' });

const Transitioned = withRouter(({ history }) => (
    <Layout>
        <Switch location={history.location}>
            <Route exact={true} path="/" component={Home} />
            <Route exact={true} path="/list" component={List} />
        </Switch>
    </Layout>
));

export default class Router extends React.Component {
    render() {
        return (
            <ConnectedRouter history={history}>
                <ThemeProvider theme={theme}>
                    <Transitioned />
                </ThemeProvider>
            </ConnectedRouter>
        );
    }
}