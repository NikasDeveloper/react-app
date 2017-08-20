import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { RouteTransition, presets } from 'react-router-transition';
import injectSheet from 'react-jss';

import Nav from './nav';

@withRouter
@injectSheet(theme => ({
    transitionedViewContainer: {
        position: 'absolute',
        width: '100%',
    },
}))
export default class Transition extends React.PureComponent {
    static propTypes = {
        children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired,
        classes: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }

    componentWillMount () {
        console.log('mounting transition');
    }

    componentWillUnmount () {
        console.log('unmounting transition');
    }

    render () {
        const { children, classes, history } = this.props;
        const { action } = history;

        const animation = action === 'PUSH' ? presets.slideLeft : presets.slideRight;

        console.log('rendering transition');

        return (
            <RouteTransition pathname={location.pathname} component={false} {...animation} runOnMount={false}>
                <div className={classes.transitionedViewContainer}>
                    {children}
                </div>
            </RouteTransition>
        );
    }
}