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

// To change password
export const changePassword = async (values) => {
    const putURL = `${apiBaseURL}/users/auth/changePassword`;
    try {
        const response = await axios.put(
            putURL,
            values,
            getConfig('application/json', true)
        );
        console.log(response.data.data);
        return response.data;
    } catch (err) {
        console.log(err.response);
        return err.response.data;
    }
};
