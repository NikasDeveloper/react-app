import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import injectSheet from 'react-jss';
import cx from 'classnames';
import { push } from 'react-router-redux';

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
    };

    componentWillMount = () => {
        console.log('mounting home');
    };

    componentWillUnmount = () => {
        console.log('unmounting home');
    };

    render = () => {
        console.log('rendering home');
        const { classes } = this.props;
        const { dispatch } = this.props;

        return (
            <div>
                <h1 className={cx(classes.root)}>Home</h1>
                <p onClick={() => dispatch(push('/list'))}>move to list</p>
                <img src={'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Big_Bear_Valley%2C_California.jpg/1200px-Big_Bear_Valley%2C_California.jpg'} />
            </div>
        );
    };
}