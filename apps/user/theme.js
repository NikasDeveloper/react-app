import { create as createJss } from 'jss';
import preset from 'jss-preset-default'
import reset from '@damianobarbati/jss-reset';

export const jss = createJss(preset());
jss.createStyleSheet(reset).attach();

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