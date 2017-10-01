import { jss } from 'react-jss';
import reset from '@damianobarbati/jss-reset';
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
        fontFamily: 'Roboto',
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