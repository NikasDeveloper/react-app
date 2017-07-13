import { create as createJss } from 'jss';
import { create as createInjectSheet } from 'react-jss';
import preset from 'jss-preset-default'
import normalize from 'normalize-jss';

const jss = createJss(preset());
jss.createStyleSheet(normalize).attach();

export default createInjectSheet(jss);