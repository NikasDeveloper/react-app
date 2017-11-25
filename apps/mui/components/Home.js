import React from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';

@withStyles(theme => ({
    bold: {
        fontWeight: 'bold',
    },
}))
export default class Home extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
    };

    render = () => {
        const { classes } = this.props;

        return (
            <Grid container={true} justify={'center'} alignContent={'center'} alignItems={'center'} wrap={'wrap'}>
                <Grid item={true} xs={12}>
                    <h1>Home</h1>
                </Grid>
                <Grid item={true} xs={12}>
                    <h2 className={cx(classes.bold)}>Lorem Ipsum Dolor Amet</h2>
                </Grid>
            </Grid>
        );
    };
}
