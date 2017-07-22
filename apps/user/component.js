import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { createStyleSheet } from 'jss-theme-reactor';
import withStyle from 'react-jss';
import { styleManager } from './style'

const styleSheet = createStyleSheet('Component', theme => ({
    root: {
        ...theme.text,
    },
}));

@withStyle(styleManager.render(styleSheet))
export default class Component extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
    }

    render() {
        const { classes } = this.props;
        console.log('classes', classes)

        return (
            <div>
                <h1 className={cx(classes.root)}>JSS theme powered!</h1>
            </div>
        );
    }
}