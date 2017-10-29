import React from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';

@withStyles(theme => ({}))
export default class Home extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
    };

    render = () => {
        const { classes } = this.props;

        return (
            <Grid container={true} justify={'center'} align={'center'}>
                <h1 className={cx(classes.h1)}>Home</h1>
            </Grid>
        );
    };
}
