import axios from "axios";
import {API_CONSTANT_MAP, API_CANCEL_TOKENS} from './../data_management/api_endpoints';
import { getApiUrl } from "./config";

export async function get(path, params) {
    const payload = params ? {params} : null;

    return request(path, 'GET', payload);
}

export async function delete_req(path, params) {
    const payload = params ? {params} : null;

    return request(path, 'DELETE', payload);
}

export async function post(path, payload) {
    return request(path, 'POST', payload);
}

export async function request(path, method, payload) {
    var pathName = path.name
    var apiConstant = API_CONSTANT_MAP[pathName]
    var pathUrl = apiConstant.url(path['params'])
    
    // Create url
    let url = getApiUrl();
    
    if (!url.endsWith('/')) {
        url += '/';
    }
    
    if (pathUrl.startsWith('/')) {
        pathUrl = pathUrl.substr(1);
    }
    url += pathUrl;

    // Build request
    let computedConfig = {
        method,
        url
      };
    
    // Define payload
    if (payload && payload.data) {
        computedConfig['data'] = payload.data;
    }
    if (payload && payload.params) {
        computedConfig['params'] = payload.params;
    }
    
    // Define Headers
    if (payload && payload.json) {
        const headers = {'Content-Type': 'application/json'};
        computedConfig['headers'] = headers;
    }
    
    // Get cancel token
    let cancelToken = API_CANCEL_TOKENS[pathName]
    cancelToken.cancel(`Operation cancelled by the user - path = ${pathName}`)
    
    // Create new cancel token
    let newCancelToken = axios.CancelToken.source()
    API_CANCEL_TOKENS[pathName] = newCancelToken
    computedConfig['cancelToken'] = newCancelToken.token

    // Get response
    let result = await axios(computedConfig);
    
    return result
}