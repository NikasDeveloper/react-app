import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Helmet from 'react-helmet';

import cx from 'classnames';
import { withStyles } from 'material-ui/styles';

@withRouter
@withStyles(theme => ({}))
@connect((state, props) => ({}))
export default class Layout extends React.Component {
    static propTypes = {
        children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired,
        dispatch: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        classes: PropTypes.object.isRequired,
    };

    render = () => {
        const { children, classes, dispatch } = this.props;

        return (
            <React.Fragment>
                <Helmet>
                    <title>MUI</title>
                    <link rel={'canonical'} href={'http://mysite.com/example'} />
                    <meta name={'apple-mobile-web-app-title'} content={'CFC'} />
                    <meta name={'application-name'} content={'CFC'} />
                </Helmet>
                <div>
                    {children}
                </div>
            </React.Fragment>
        );
    };
}