//@flow

import {apiLink} from "./config";

function request(url: string, method: string, options: RequestOptions = {}): Promise<Request> {
    const newHeaders = options.headers
        ? options.headers
        : {}
    const newUrl: string = url.includes('://') ? url : apiLink + url;
    const newOptions: RequestOptions = {
        ...options,
        method,
        headers: {
            ...newHeaders,
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        mode: 'no-cors'
    }

    return fetch(newUrl, newOptions);
}

export function get(url: string, options?: RequestOptions): Promise<Response> {
    return request(url, 'get', options);
}
