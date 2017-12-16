import * as types from './types';
import axios from 'axios';
import graph from 'graphjql/src/AxiosGraph';
import { push } from 'react-router-redux';

export { graph, axios };

const USER_NOT_FOUND = 'USER_NOT_FOUND';
const SERVER_ERROR = 'SERVER_ERROR'

export const init = () => ({ type: types.INIT });

export const compute = value => ({ type: types.COMPUTE, value });

export const computed = value => ({ type: types.COMPUTED, value });

export const notify = ({ level, content }) => ({ type: types.NOTIFY, level, content });

export const notified = () => ({ type: types.NOTIFIED });

export const set = (key, value) => ({ type: types.SET, key, value });

export const unset = key => ({ type: types.UNSET, key });

export const q = async (label, query) => {
    return async dispatch => {
        try {
            dispatch(compute(label));
            const result = await graph.q(query);
            dispatch(set(label, result));
            dispatch(computed(label));
            return result;
        }
        catch (error) {
            dispatch(computed(label));
            throw error;
        }
    };
};

export const consume = async (label, endpoint, parameters) => {
    return async dispatch => {
        try {
            dispatch(compute(label));
            const { data: result } = await axios.post(endpoint, parameters);
            dispatch(set(label, result));
            dispatch(computed(label));
            return result;
        }
        catch (error) {
            dispatch(computed(label));
            throw error.response.data;
        }
    };
};

export const signIn = ({ identifier = '', secret = '', role } = {}) => {
    return async dispatch => {
        try {
            const result = await consume('signIn', '/api/auth/signIn', { identifier, secret, role });
            return result;
        }
        catch (error) {
            throw error.response.data;
        }
    };
};

export const signOut = () => {
    return dispatch => {
        dispatch({ type: types.INIT });
        dispatch(push('/sign-in'));
    };
};