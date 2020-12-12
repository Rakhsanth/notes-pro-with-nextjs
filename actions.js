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
} from './actionTypes';

const getAxiosConfig = (contentType, withCredentials) => {
    let axiosConfig = {
        headers: {
            'Content-Type': contentType,
        },
        withCredentials: withCredentials,
    };
    return axiosConfig;
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
        try {
            const response = await axios.get(
                `${apiBaseURL}/users/auth/me`,
                getAxiosConfig('application/json', true)
            );
            dispatch({ type: LOAD_USER, payload: response.data.data });
        } catch (err) {
            // console.log(err.response);
            dispatch({ type: AUTH_ERROR, payload: err.response });
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
                getAxiosConfig('application/json', true)
            );
            dispatch({ type: REGISTER_USER, payload: response.data });
            dispatch(loadUser());
        } catch (err) {
            // console.log(err.response);
            dispatch({ type: AUTH_ERROR, payload: err.response });
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
                getAxiosConfig('application/json', true)
            );
            dispatch({ type: LOGIN_USER, payload: response.data });
            dispatch(loadUser());
        } catch (err) {
            // console.log(err.response);
            dispatch({ type: AUTH_ERROR, payload: err.response });
        }
    };
};
// Logout action
export const logout = () => {
    return async function (dispatch) {
        try {
            const getURL = `${apiBaseURL}/users/auth/logout`;
            const response = await axios.get(
                getURL,
                getAxiosConfig('aaplication/json', true)
            );
            dispatch({ type: LOGOUT_USER, payload: response.data });
        } catch (err) {
            dispatch({ type: AUTH_ERROR, payload: err.response.data });
        }
    };
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
