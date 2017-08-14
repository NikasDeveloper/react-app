import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import { RouteTransition, presets } from 'react-router-transition';
import injectSheet from 'react-jss'
import cx from 'classnames';

import Nav from './nav';

@withRouter
@injectSheet(theme => ({
    root: {
        backgroundColor: 'green',
    },
    transitionContainer: {
        width: '100vw',
    },
    transitionedViewContainer: {
        position: 'absolute',
    },
}))
@connect((state, props) => ({ }))
export default class Layout extends React.Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        dispatch: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        classes: PropTypes.object.isRequired,
    }

    render () {
        const { children, history, classes } = this.props;
        const { action } = history;

        const animation = action === 'PUSH' ? presets.slideLeft : presets.slideRight;

        return (
            <div>
                <Nav />
                <RouteTransition pathname={location.pathname} {...animation} className={cx(classes.transitionContainer)}>
                    <div className={cx(classes.transitionedViewContainer)}>
                        {children}
                    </div>
                </RouteTransition>
            </div>
        );
    }
}