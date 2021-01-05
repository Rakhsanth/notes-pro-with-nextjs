import { apiBaseURL } from '../config/config';
import axios from 'axios';

const getConfig = (contentType, needAuth, withCredentials) => {
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
