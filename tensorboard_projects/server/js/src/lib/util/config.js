import dotenv from 'dotenv';

dotenv.config()
window._env = process.env

export const getBasePath = () => {
    let val = window._env["REACT_APP_BASE_PATH"];
    if (!val) {
        return ""
    } else {
        if (val.endsWith('/')) {
            val = val.slice(0, -1);
        }
        
        return val
    }
}

export const getApiUrl = () => {
    const val = window.API_URL;

    if (!val) {
        throw new Error('REACT_APP_TENSORBOARD_PROJECTS_PROXY is not set')
    } else {
        return val
    }
}

export const getReduxLogger = () => {
    return "on"
}