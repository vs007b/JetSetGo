import axios from 'axios';

const HEADERS = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};

const callApi = async (args) => {
    const { url, method, body, queryParams, headers } = args;

    const queryString = queryParams ? new URLSearchParams(queryParams).toString() : '';
    const newUrl = queryParams ? `${url}?${queryString}` : url;

    const options = {
        method,
        headers: {
            ...HEADERS,
        },
    };

    if (headers) {
        options.headers = {
            ...options.headers,
            ...headers,
        };
    }

    if (body) {
        options.data = body;
    }

    try {
        const response = await axios(newUrl, options);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Handle Axios-specific errors here
            const axiosError = error;
            if (axiosError.response) {
                console.error(`HTTP response error (Status: ${axiosError.response.status})`);
                console.error(axiosError.response.data); // You can log the response data for debugging
            } else if (axiosError.request) {
                console.error('Network error: Request failed to be sent');
            } else {
                console.error('Other Axios error:', axiosError.message);
            }
        } else {
            // Handle non-Axios errors
            console.error('Non-Axios error:', error?.message);
        }

        throw error; // Re-throw the error to be handled by the calling code
    }
};

export default callApi;
