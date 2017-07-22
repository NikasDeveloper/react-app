import React from 'react';
import commonStyles from '../styles/common.scss';
import styles from './component1.scss'
import classNames from 'classnames';

import img from '../images/img.jpg';

export default class Component1 extends React.Component {
    render() {
        return (
            <div>
                <h1 className={classNames(commonStyles.blue, commonStyles.noDupe, commonStyles.bordered, styles.bordered)}>CMP1 NODE_ENV {'='} {process.env.NODE_ENV}</h1>
                <img src={img} width={200} />
            </div>
        )
    }
}