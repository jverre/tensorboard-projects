import axios from "axios";
import queryString from 'qs';

export const API_MODELS = "API_MODELS";
export const API_MODEL = "API_MODEL";
export const API_RUNS = "API_RUNS";
export const API_DOCUMENTATION = "API_DOCUMENTATION";
export const API_DASHBOARD = "API_DASHBOARD";


export const addParams = (url, params, json) => {
    if (!params) {
        return url
    } else {
        let params_filtered = params.filter( x => x['value'] !== undefined)
        if (params_filtered.length === 0) {
            return url
        }
        
        var url_params;
        var parameters = {};
        for (const param of params_filtered) {
            parameters[param['key']] = param['value']
        }
        url_params = url.concat('?').concat(queryString.stringify(parameters))
        
        return url_params
    }
}

export const API_CONSTANT_MAP = {
    API_MODELS: {
        "url": (params) => (`/api/models`)
    },
    API_MODEL: {
        "url": (params) => (`/api/model/${params.modelId}`)
    },
    API_RUNS: {
        "url": (params) => (`/api/model/${params.modelId}/runs`)
    },
    API_DOCUMENTATION : {
        "url": (params) => (`/api/model/${params.modelId}/documentation`)
    },
    API_DASHBOARD : {
        "url": (params) => (`/api/dashboards`)
    },
}

var CancelToken = axios.CancelToken;
export const API_CANCEL_TOKENS = Object.keys(API_CONSTANT_MAP).reduce((obj, key) => {
    obj[key] = CancelToken.source()

    return obj
}, {})