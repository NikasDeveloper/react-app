import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import {} from 'lodash-es';
import cx from 'classnames';
import injectSheet from 'react-jss'

@withRouter
@injectSheet(theme => ({
    root: {
        ...theme.home,
        backgroundColor: 'green',
    },
}))
@connect((state, props) => ({ }))
export default class Home extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        classes: PropTypes.object.isRequired,
    }

    render () {
        const { dispatch, location, classes } = this.props;

        return (
            <h1 className={cx(classes.root)} >Home</h1>
        );
    }
}