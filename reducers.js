import { combineReducers } from 'redux';
import {
    LOGIN_USER,
    RESET_LOADING,
    REGISTER_USER,
    LOGOUT_USER,
    LOAD_USER,
    AUTH_ERROR,
    GET_NOTES,
    CREATE_NOTE,
    DELETE_NOTE,
    NOTES_ERROR,
} from './actionTypes';

// Auth reducer
const initialAuth = {
    loading: true,
    loggedIn: false,
    token: null,
    user: {},
    other: null,
    error: false,
};
const authReducer = (state = initialAuth, action) => {
    const { type, payload } = action;
    switch (type) {
        case RESET_LOADING:
            if (payload === 'auth') {
                return { ...state, loading: true };
            } else {
                return state;
            }
        case LOAD_USER:
            console.log(action);
            return {
                ...state,
                loading: false,
                loggedIn: true,
                token: null,
                user: payload,
                other: null,
                error: false,
            };
        case LOGIN_USER:
            return {
                ...state,
                loading: false,
                loggedIn: true,
                token: payload.token,
                other: null,
                error: false,
            };
        case REGISTER_USER:
            return {
                ...state,
                loading: false,
                loggedIn: true,
                token: payload.token,
                other: null,
                error: false,
            };
        case LOGOUT_USER:
            return {
                ...state,
                loading: true,
                loggedIn: false,
                token: null,
                user: {},
                other: payload,
                error: false,
            };
        case AUTH_ERROR:
            return {
                ...state,
                loading: false,
                loggedIn: false,
                token: null,
                other: payload,
                error: true,
            };
        default:
            return state;
    }
};

// Notes reducers
const initialNotes = {
    loading: true,
    totalCount: 0,
    prev: null,
    next: null,
    notes: [],
    other: null,
    error: false,
};
const notesReducer = (state = initialNotes, action) => {
    const { type, payload } = action;
    switch (type) {
        case RESET_LOADING:
            if (payload === 'notes') {
                return { ...state, loading: true };
            } else {
                return state;
            }
        case GET_NOTES:
            return {
                ...state,
                loading: false,
                totalCount: payload.count,
                prev: payload.prev,
                next: payload.next,
                notes: payload.data,
                other: null,
                error: false,
            };
        case LOGOUT_USER:
            return {
                ...state,
                loading: true,
            };
        case NOTES_ERROR:
            return {
                ...state,
                loading: false,
                totalCount: 0,
                prev: null,
                next: null,
                notes: [],
                other: payload,
                error: true,
            };
        default:
            return state;
    }
};

export default combineReducers({
    auth: authReducer,
    notes: notesReducer,
});
