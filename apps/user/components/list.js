import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import injectSheet from 'react-jss';
import cx from 'classnames';
import { push } from 'react-router-redux';

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
    };

    componentWillMount = () => {
        console.log('mounting list');
    };

    componentWillUnmount = () => {
        console.log('unmounting list');
    };

    render = () => {
        console.log('rendering list');
        const { classes } = this.props;
        const { dispatch } = this.props;

        return (
            <div>
                <h1 className={cx(classes.root)}>List</h1>
                <p onClick={() => dispatch(push('/'))}>move to home</p>
            </div>
        );
    };
}