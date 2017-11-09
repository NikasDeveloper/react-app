import { jss } from 'react-jss';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import { amber, blue, green, grey, lime, pink, red } from 'material-ui/colors';

import roboto400 from 'typeface-roboto/files/roboto-latin-400.woff';
import roboto700 from 'typeface-roboto/files/roboto-latin-700.woff';

//font loading
jss.createStyleSheet({
    '@font-face': {
        fontFamily: 'Roboto',
        fontWeight: 'normal',
        fontStyle: 'normal',
        src: `url(${roboto400}) format('woff')`,
    },
}).attach();

jss.createStyleSheet({
    '@font-face': {
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        fontStyle: 'normal',
        src: `url(${roboto700}) format('woff')`,
    },
}).attach();

jss.createStyleSheet({
    '@global': {
        'html, body': {
            margin: 0,
            padding: 0,
            height: '100%',
            width: '100%',
            overflow: 'auto',
            '-webkit-overflow-scrolling': 'touch',
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        },
    },

}).attach();

const overrides = {
    MuiGrid: {
        'spacing-xs-8': {
            width: '100%',
            margin: 0,
            padding: '4px',
        },
        'spacing-xs-16': {
            width: '100%',
            margin: 0,
            padding: '8px',
        },
        'spacing-xs-24': {
            width: '100%',
            margin: 0,
            padding: '12px',
        },
        'spacing-xs-40': {
            width: '100%',
            margin: 0,
            padding: '20px',
        },
    }
};

export const colors = {};

const customVariables = {
    colors,
};

const theme = createMuiTheme({ overrides, ...customVariables });

export default theme;
