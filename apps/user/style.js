import { create as createJss } from 'jss';
import preset from 'jss-preset-default'
import reset from '@damianobarbati/jss-reset';
import { createStyleManager } from 'jss-theme-reactor';

export const jss = createJss(preset());

jss.createStyleSheet(reset).attach();

export const theme = {
    text: {
        fontFamily: 'Verdana',
        fontSize: 12,
        fontWeight: 'bold',
        color: 'red',
    },
};

export const styleManager = createStyleManager({ jss, theme });