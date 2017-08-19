import { jss } from 'react-jss';
import reset from '@damianobarbati/jss-reset';
import sfWoff from './fonts/sf.woff';

//reset
jss.createStyleSheet(reset).attach();

//use font
jss.createStyleSheet({
    '@global html, body': {
        fontFamily: 'San Francisco',
    },
}).attach();

//font loading
jss.createStyleSheet({
    '@font-face': {
        fontFamily: 'San Francisco',
        fontWeight: 'normal',
        fontStyle: 'normal',
        src: `url(${sfWoff}) format("woff")`,
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