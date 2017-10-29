import { cloneDeep, pull, sortBy, uniqBy } from 'lodash-es';
import * as types from './types';

const defaultState = {
    computing: [],
    notification: null,
    token: null,
    user: null,
    data: {},
};

export default (previousState = defaultState, action) => {
    const state = cloneDeep(previousState);

    switch(action.type) {
        case types.NOOP: {
            return state;
        }
        case types.INIT: {
            return defaultState;
        }
        case types.COMPUTE: {
            const { value } = action;
            state.computing.push(value);
            return state;
        }
        case types.COMPUTED: {
            const { value } = action;
            pull(state.computing, value);
            return state;
        }
        case types.NOTIFY: {
            const { level, value } = action;
            state.notification = { level, value };
            return state;
        }
        case types.NOTIFIED: {
            state.notification = null;
            return state;
        }
        case types.SIGN_IN: {
            const { token, user } = action;
            state.token = token;
            state.user = user;
            return state;
        }
        case types.SIGN_OUT: {
            state.token = null;
            state.user = null;
            return state;
        }
        case types.CLEAR: {
            const { label, value } = action;

            if(!label)
                state.data = {};
            else if(state.data[label]) {
                if(!value)
                    delete state.data[label];
                else
                    state.data[label] = value;
            }

            return state;
        }
        case types.GET: {
            const { label, value, prepend, append, sortBy: sortByKey, uniqueBy: uniqueByKey } = action;

            let previousValue = state.data[label];
            let nextValue = value;

            if(prepend)
                nextValue = nextValue.concat(previousValue || []);

            if(append)
                nextValue = (previousValue || []).concat(nextValue);

            if(sortByKey)
                nextValue = sortBy(nextValue, sortByKey);

            if(uniqueByKey)
                nextValue = uniqBy(nextValue, uniqueByKey);

            state.data[label] = nextValue;
            return state;
        }
        default: {
            return previousState;
        }
    }
};