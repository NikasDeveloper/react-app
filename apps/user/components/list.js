import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import injectSheet from 'react-jss'
import cx from 'classnames';

@withRouter
@injectSheet(theme => ({
    root: {
        ...theme.list,
        backgroundColor: 'red',
    },
}))
@connect((state, props) => ({ }))
export default class List extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        classes: PropTypes.object.isRequired,
    }

    componentWillMount () {
        console.log('mounting list');
    }

    render () {
        const { dispatch, location, classes } = this.props;
        console.log('rendering list');

        return (
            <div>
                <h1 className={cx(classes.root)}>List</h1>
            </div>
        );
    }
}