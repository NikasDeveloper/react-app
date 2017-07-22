import React from 'react';
import commonStyles from '../styles/common.scss';
import styles from './component2.scss'
import classNames from 'classnames';

export default class Component2 extends React.Component {
    render() {
        return (
            <div>
                <p className={classNames(commonStyles.bordered, commonStyles.noDupe, styles.bordered)}>CMP2 NODE_ENV {'='} {process.env.NODE_ENV}</p>
            </div>
        )
    }
}