import React from 'react';
import { Link } from 'react-router-dom';

export default class Nav extends React.Component {
    render() {
        return (
            <ul>
                <li>
                    <Link to="/component1">component1</Link>
                </li>
                <li>
                    <Link to="/component2">component2</Link>
                </li>
            </ul>
        )
    }
}