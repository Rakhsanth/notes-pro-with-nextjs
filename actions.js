import axios from 'axios';
import { apiBaseURL } from './config/config';
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
    SET_ALERT,
    REMOVE_ALERT,
} from './actionTypes';

const getAxiosConfig = (contentType, needAuth, withCredentials) => {
    let axiosConfig;

    if (needAuth) {
        let token;
        if (localStorage.token) {
            token = localStorage.getItem('token');
        }
        axiosConfig = {
            headers: {
                'Content-Type': contentType,
                Authorization: `Bearer ${token}`,
            },
            withCredentials: withCredentials,
        };
    } else {
        axiosConfig = {
            headers: {
                'Content-Type': contentType,
            },
            withCredentials: withCredentials,
        };
    }

    return axiosConfig;
};

// action to show alerts or info
export const setAlert = (color, message, timeout) => {
    // not an async function as it is not related to API calls and just static timeout
    return function (dispatch) {
        dispatch({ type: SET_ALERT, payload: { color, message } });
        setTimeout(
            () => dispatch({ type: REMOVE_ALERT, payload: { color, message } }),
            timeout * 1000
        );
    };
};

// Simple action creator for resetting loading state for re-renderings
export const resetLoading = (state) => {
    return {
        type: RESET_LOADING,
        payload: state,
    };
};
// Load current user data
export const loadUser = () => {
    return async function (dispatch) {
        dispatch(resetLoading('notes'));
        try {
            const response = await axios.get(
                `${apiBaseURL}/users/auth/me`,
                getAxiosConfig('application/json', true)
            );
            dispatch({ type: LOAD_USER, payload: response.data.data });
        } catch (err) {
            // console.log(err.response);
            if (err.response !== undefined) {
                console.log(err.response.status);
                dispatch(setAlert('#3F51B5', 'User not logged in', 3));
                dispatch({ type: AUTH_ERROR, payload: err.response });
            } else {
                dispatch(
                    setAlert('red', 'Server down, please try again later', 3)
                );
            }
        }
    };
};
// Register action
export const registerUser = (body) => {
    return async function (dispatch) {
        try {
            const response = await axios.post(
                `${apiBaseURL}/users/register`,
                body,
                getAxiosConfig('application/json')
            );
            dispatch({ type: REGISTER_USER, payload: response.data });
            dispatch(loadUser());
            dispatch(setAlert('green', 'Logged in successfully', 3));
        } catch (err) {
            // console.log(err.response);
            if (err.response !== undefined) {
                console.log(err.response.status);
                dispatch(setAlert('red', 'User not logged in, try again !', 3));
                dispatch({ type: AUTH_ERROR, payload: err.response });
            } else {
                dispatch(
                    setAlert('red', 'Server down, please try again later', 3)
                );
            }
        }
    };
};
// Login action
export const loginUser = (body) => {
    return async function (dispatch) {
        try {
            const response = await axios.post(
                `${apiBaseURL}/users/login`,
                body,
                getAxiosConfig('application/json')
            );
            dispatch({ type: LOGIN_USER, payload: response.data });
            dispatch(loadUser());
            dispatch(setAlert('green', 'Logged in successfully', 3));
        } catch (err) {
            // console.log(err.response);
            if (err.response !== undefined) {
                console.log(err.response.status);
                dispatch(
                    setAlert('red', 'User not logged in, check credentials', 3)
                );
                dispatch({ type: AUTH_ERROR, payload: err.response });
            } else {
                dispatch(
                    setAlert('red', 'Server down, please try again later', 3)
                );
            }
        }
    };
};
// Logout action
export const logout = () => {
    if (localStorage.token) {
        localStorage.removeItem('token');
    }
    return { type: LOGOUT_USER };
};
// Get notes of a user
export const getNotes = (pageNum, limit) => {
    return async function (dispatch) {
        try {
            let getURL = `${apiBaseURL}/notes`;
            if (pageNum) {
                getURL = getURL + `?page=${pageNum}`;
            }
            if (limit) {
                if (getURL.indexOf('?') === -1) {
                    getURL = getURL + `?limit=${limit}`;
                } else {
                    getURL = getURL + `&limit=${limit}`;
                }
            }
            const response = await axios.get(
                getURL,
                getAxiosConfig('application/json', true)
            );
            dispatch({ type: GET_NOTES, payload: response.data });
        } catch (err) {
            // console.log(err.response);
            dispatch({ type: NOTES_ERROR, payload: err.response });
        }
    };
};
// create note for a user
export const createNote = (note) => {
    return async function (dispatch) {
        try {
            let postURL = `${apiBaseURL}/notes`;
            const response = await axios.post(
                postURL,
                note,
                getAxiosConfig('application/json', true)
            );
            dispatch({ type: CREATE_NOTE, payload: response.data.data });
        } catch (err) {
            // console.log(err.response);
            dispatch({ type: NOTES_ERROR, payload: err.response });
        }
    };
};
// Delete a note of a user
export const deleteNote = (noteId) => {
    return async function (dispatch) {
        try {
            let deleteURL = `${apiBaseURL}/notes/${noteId}`;

            const response = await axios.delete(
                deleteURL,
                getAxiosConfig('application/json', true)
            );
            dispatch({ type: DELETE_NOTE, payload: noteId });
        } catch (err) {
            // console.log(err.response);
            dispatch({ type: NOTES_ERROR, payload: err.response });
        }
    };
};
