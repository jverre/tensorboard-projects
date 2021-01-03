import {createApi} from './lib/data_management/api'

export const API = window.__api || createApi({
    name      : 'Tensorboard Projects v1'
});

export default window.__api = API;