import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom'
import { push } from 'react-router-redux';
import injectSheet from 'react-jss'
import cx from 'classnames';

import { name } from '../../../package';

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
    };

    render = () => {
        const { dispatch, location, classes } = this.props;

        return (
            <ul className={cx(classes.root)}>
                <NavLink to={'/'} activeClassName={classes.selectedLi} exact={true} strict={true}>
                    <li className={cx(classes.li)}>{name} - home</li>
                </NavLink>
                <NavLink to={'/list'} activeClassName={classes.selectedLi} exact={true} strict={true}>
                    <li className={cx(classes.li)}>{name} - list</li>
                </NavLink>
            </ul>
        );
    }
}