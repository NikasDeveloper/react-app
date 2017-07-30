import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom'
import { push } from 'react-router-redux';
import {} from 'lodash-es';
import cx from 'classnames';
import injectSheet from 'react-jss'

@withRouter
@injectSheet(theme => ({
    root: {
        ...theme.nav,
    },
    li: {
        display: 'inline-block',
        padding: '20px',
        fontSize: '18px',
        fontWeight: 'bold',
    },
    selectedLi: {
        backgroundColor: 'blue',
    },
}))
@connect((state, props) => ({ }))
export default class Nav extends React.Component {
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
            <ul className={cx(classes.root)}>
                <NavLink to={'/'} activeClassName={classes.selectedLi} exact={true} strict={true}>
                    <li className={cx(classes.li)}>home</li>
                </NavLink>
                <NavLink to={'/list'} activeClassName={classes.selectedLi} exact={true} strict={true}>
                    <li className={cx(classes.li)}>list</li>
                </NavLink>
            </ul>
        );
    }
}