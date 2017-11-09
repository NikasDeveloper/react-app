import { jss } from 'react-jss';
import reset from 'jss-reset';
import roboto400 from 'typeface-roboto/files/roboto-latin-400.woff';
import roboto700 from 'typeface-roboto/files/roboto-latin-700.woff';

//reset
jss.createStyleSheet(reset).attach();

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

//use font
jss.createStyleSheet({
    '@global html, body': {
        margin: 0,
        padding: 0,
        height: '100%',
        width: '100%',
        overflow: 'auto',
        '-webkit-overflow-scrolling': 'touch',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    },
}).attach();

const theme = {
    nav: {
    },
    home: {
        display: 'inline',
        width: '500px',
        textAlign: 'center',
    },
    list: {
        display: 'inline',
        width: '500px',
        textAlign: 'center',
    },
};

export default theme;