import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyle from 'react-jss';

const styles = {
    '@global': {
        body: {
            backgroundColor: 'black',
        },
    },
    root: {
        background: 'yellow',
        'margin-start': '1px',
    },
}

@withStyle(styles)
export default class Component1 extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <h1 className={classNames(classes.root)}>Admin with custom jss!</h1>
            </div>
        );
    }
}