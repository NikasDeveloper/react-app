import { jss } from 'react-jss';
import reset from '@damianobarbati/jss-reset';

//reset
jss.createStyleSheet(reset).attach();

//font loading
jss.createStyleSheet({
    '@font-face': {
        fontFamily: 'San Francisco',
        src: [
            'url("../fonts/sf.eot")',
            'url("../fonts/sf.eot?#iefix") format("embedded-opentype")',
            'url("../fonts/sf.woff2") format("woff2")',
            'url("../fonts/sf.woff") format("woff")',
            'url("../fonts/sf.ttf") format("truetype")',
            'url("../fonts/sf.svg") format("svg")',
        ],
    },
}).attach();

//use font
jss.createStyleSheet({
    'html, body': {
        fontFamily: 'San Francisco',
    },
});

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