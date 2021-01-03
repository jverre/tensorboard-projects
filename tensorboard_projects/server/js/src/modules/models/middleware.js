import { API_MODELS, API_MODEL } from './../../lib/data_management/api_endpoints';  
import API           from "./../../api";
import * as actions  from './actions';

export async function get_models(action) {
    const path = {
      'name': API_MODELS
    }
    
    const res = await API.get(path);
    return res.data
}

export async function add_model(action) {
    var path = {
      'name': API_MODEL,
      'params': action.payload.params
    }
    
    const payload = action.payload.payload;
    const res = await API.post(path, payload);
    return res.data
}

export async function delete_model(action) {
    var path = {
      'name': API_MODEL,
      'params': action.payload.params
    }
    
    const res = await API.delete(path, null);
    return res.data
}

export default {
    "[MODELS] GET_MODELS__SUBMIT": async (store, next, action) => {
        try {
            const result = await get_models(action)
            store.dispatch(actions.getModels.resolved(result));
        } catch (error) {
            store.dispatch(actions.getModels.rejected(error));
        }
    },
    "[MODELS] ADD_OR_EDIT_MODEL__SUBMIT": async (store, next, action) => {
        try {
            const result = await add_model(action)
            store.dispatch(actions.addEditModel.resolved(result));
        } catch (error) {
            store.dispatch(actions.addEditModel.rejected(error));
        }
    },
    "[MODELS] DELETE_MODEL__SUBMIT": async (store, next, action) => {
        try {
            const result = await delete_model(action)
            store.dispatch(actions.deleteModel.resolved(result));
        } catch (error) {
            store.dispatch(actions.deleteModel.rejected(error));
        }
    }
}