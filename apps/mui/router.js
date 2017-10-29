import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import { MuiThemeProvider } from 'material-ui/styles';
import theme from './theme';

// general components
import Layout from './components/Layout';

// specific routes
import Home from './components/Home';

export const history = createHistory({ basename: '/mui' });

export default class Router extends React.Component {
    render() {
        return (
            <ConnectedRouter history={history}>
                <MuiThemeProvider theme={theme}>
                    <Layout>
                        <Switch>
                            <Route exact path={'/'} component={Home} />
                        </Switch>
                    </Layout>
                </MuiThemeProvider>
            </ConnectedRouter>
        );
    }
}
