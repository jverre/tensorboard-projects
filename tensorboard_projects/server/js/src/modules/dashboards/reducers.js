import { CREATE_DASHBOARD, GET_DASHBOARDS, STOP_DASHBOARD } from './actions'
import {networkStateReducer, reducer} from '../../lib/util/redux'

const initialStateProject = {
    value: [],
    defaultValue: [],
    error: null,
    pending: false,
    rejected: false,
    resolved: false
};

export default function models(state = initialStateProject, action) {
    state = Object.assign({}, state, networkStateReducer(GET_DASHBOARDS, state, action))

    state = Object.assign({}, state, networkStateReducer(CREATE_DASHBOARD, state, action))
    
    state = Object.assign({}, state, networkStateReducer(STOP_DASHBOARD, state, action))
    
    return reducer(state, action, {})
}