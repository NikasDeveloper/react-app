import * as types from './types';
import graph from '../graph.js';
import axios from 'axios'; //axios is already imported from graph with baseURL overidden, this can be handled better
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form'

export const noop = () => ({ type: types.NOOP });

export const init = () => ({ type: types.INIT });

export const compute = value => ({ type: types.COMPUTE, value });

export const computed = value => ({ type: types.COMPUTED, value });

export const notify = ({ level, value }) => ({ type: types.NOTIFY, level, value });

export const notified = () => ({ type: types.NOTIFIED });

export const clear = (label, value) => ({ type: types.CLEAR, label, value });

export const get = async (label, query, { prepend = false, append = false, sortBy = null, uniqueBy = null } = {}) => {
    return async dispatch => {
        dispatch(compute(label));

        const result = await graph.get(query);
        dispatch({ type: types.GET, label, value: result, prepend, append, sortBy, uniqueBy });

        dispatch(computed(label));

        return result;
    };
};

export const consume = async (label, endpoint, parameters, { prepend = false, append = false, sortBy = null, uniqueBy = null } = {}) => {
    return async dispatch => {
        dispatch(compute(label));

        const { data: result } = await axios.post(endpoint, parameters);
        dispatch({ type: types.GET, label, value: result, prepend, append, sortBy, uniqueBy });

        dispatch(computed(label));

        return result;
    };
};

export const signIn = ({ identifier = '', secret = '' } = {}) => {
    return async dispatch => {
        try {
            dispatch(compute('signIn'));

            const { data: token } = await axios.post('/api/auth/signIn', { identifier, secret });
            if(!token) {
                dispatch(notify({ level: 'failure', value: 'User not found' }));
                return false;
            }

            const { data: user } = await axios.post('/api/auth/me', { token });
            if(!user) {
                dispatch(notify({ level: 'failure', value: 'Internal error occourred, please try again later' }));
                return false;
            }

            dispatch({ type: types.SIGN_IN, token, user });
            dispatch(push('/'));

            dispatch(computed('signIn'));
            return true;
        }
        catch (error) {
            dispatch(computed('signIn'));
            dispatch(notify({ level: 'failure', value: 'Internal error occourred, please try again later' }));
            return false;
        }
    };
};

export const signOut = () => {
    return dispatch => {
        dispatch({ type: types.SIGN_OUT });
        dispatch(push('/sign-in'));
    };
};

export const connect = async ({ token, strategy, accessToken, refreshToken }) => {
    return async dispatch => {
        dispatch(compute('connect'));
        const { data: result } = await axios.post('/api/main/connect', { token, strategy, accessToken, refreshToken });
        dispatch(computed('connect'));
        return result;
    };
};