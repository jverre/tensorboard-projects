import { GET_MODELS, ADD_EDIT_MODEL, DELETE_MODEL } from './actions'
import {networkStateReducer, reducer} from './../../lib/util/redux'

const initialStateProject = {
    value: [],
    defaultValue: [],
    error: null,
    pending: false,
    rejected: false,
    resolved: false
};

export default function models(state = initialStateProject, action) {
    state = Object.assign({}, state, networkStateReducer(GET_MODELS, state, action))
    
    // Add model
    if (action.type === ADD_EDIT_MODEL + '__RESOLVED') {
        const modelId = action.payload.model_id;
        const payload = state.value;
        const payload_index = payload.map(function(e) { return e.model_id; }).indexOf(modelId);
        
        if (payload_index !==  -1) {
          payload[payload_index] = {...payload[payload_index], ...action.payload}
        } else {
          payload.push(action.payload)
        }
        
        action.payload = payload;
        state = Object.assign({}, state, networkStateReducer(ADD_EDIT_MODEL, state, action))
    }

    // Delete Model
    if (action.type === DELETE_MODEL + '__RESOLVED') {
      const modelId = action.payload.model_id;
      action.payload = state.value.filter( x => x.model_id !== modelId);
      state = Object.assign({}, state, networkStateReducer(DELETE_MODEL, state, action))
    }
    
    return reducer(state, action, {})
}