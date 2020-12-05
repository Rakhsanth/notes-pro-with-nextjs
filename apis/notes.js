import { apiBaseURL } from '../config/config';
import axios from 'axios';

const getConfig = (contentType, withCredentials) => {
    return {
        headers: {
            'Content-Type': contentType,
        },
        withCredentials,
    };
};
// To create a note
export const createNote = async (note) => {
    const postURL = `${apiBaseURL}/notes`;
    try {
        const response = await axios.post(
            postURL,
            note,
            getConfig('application/json', true)
        );
        console.log(response.data.data);
    } catch (err) {
        console.log(err.response);
    }
};
// To edit a note
export const updateNote = async (note, noteId) => {
    const putURL = `${apiBaseURL}/notes/${noteId}`;
    try {
        const response = await axios.put(
            putURL,
            note,
            getConfig('application/json', true)
        );
        console.log(response.data.data);
    } catch (err) {
        console.log(err.response);
    }
};
// To delete a note
export const deleteNote = async (noteId) => {
    const deleteURL = `${apiBaseURL}/notes/${noteId}`;
    try {
        const response = await axios.delete(
            deleteURL,
            getConfig('application/json', true)
        );
        console.log(response.data);
    } catch (err) {
        console.log(err.response);
    }
};
