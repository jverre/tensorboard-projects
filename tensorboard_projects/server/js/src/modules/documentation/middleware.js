import { API_DOCUMENTATION } from './../../lib/data_management/api_endpoints';  
import API           from "./../../api";
import * as actions  from './actions';

export async function get_model_documentation(action) {
    var path = {
      'name': API_DOCUMENTATION,
      'params': {
        'modelId': action.payload.params.modelId,
      }
    }
    
    var res = await API.get(path);
    return res.data
}

export async function post_model_documentation(action) {
    const path = {
      'name': API_DOCUMENTATION,
      'params': {
        'modelId': action.payload.params.modelId,
      }
    }
    const payload = action.payload.payload;
    
    const res = await API.post(path, payload);
    return res.data
}

export default {
    "[DOCUMENTATION] GET_DOCUMENTATION__SUBMIT": async (store, next, action) => {
        try {
            const result = await get_model_documentation(action)
            store.dispatch(actions.getDocumentation.resolved(result));
        } catch (error) {
            store.dispatch(actions.getDocumentation.rejected(error));
        }
    },
    "[DOCUMENTATION] POST_DOCUMENTATION__SUBMIT": async (store, next, action) => {
        try {
            const result = await post_model_documentation(action)
            store.dispatch(actions.postDocumentation.resolved(result));
        } catch (error) {
            store.dispatch(actions.postDocumentation.rejected(error));
        }
    }
}