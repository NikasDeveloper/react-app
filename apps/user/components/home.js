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

    componentWillMount () {
        console.log('mounting home');
    }

    render () {
        const { dispatch, location, classes } = this.props;
        console.log('rendering home');

        return (
            <div>
                <h1 className={cx(classes.root)}>Home</h1>
                <img src={'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Big_Bear_Valley%2C_California.jpg/1200px-Big_Bear_Valley%2C_California.jpg'} />
            </div>
        );
    }
}