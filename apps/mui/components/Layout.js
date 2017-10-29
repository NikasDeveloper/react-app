import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

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
            <div>
                {children}
            </div>
        );
    };
}