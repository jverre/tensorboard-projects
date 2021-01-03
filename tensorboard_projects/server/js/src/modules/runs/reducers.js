import { ARCHIVE_RUNS, UNARCHIVE_RUNS, GET_RUNS, DELETE_RUNS, EDIT_RUNS } from './actions'
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
    state = Object.assign({}, state, networkStateReducer(GET_RUNS, state, action))
    
    if (action.type === ARCHIVE_RUNS + '__RESOLVED') {
        action.payload = state.value.map(x => {
            x['archived'] = action.payload.archived_runs.includes(x.path)

            return x
        })
        state = Object.assign({}, state, networkStateReducer(ARCHIVE_RUNS, state, action))
    }

    if (action.type === UNARCHIVE_RUNS + '__RESOLVED') {
        action.payload = state.value.map(x => {
            x['archived'] = action.payload.archived_runs.includes(x.path)

            return x
        })
        state = Object.assign({}, state, networkStateReducer(ARCHIVE_RUNS, state, action))
    }

    if (action.type === DELETE_RUNS + '__RESOLVED') {
        action.payload = state.value.filter(x => action.payload.deleted_runs.includes(x['path']) === false)
        state = Object.assign({}, state, networkStateReducer(DELETE_RUNS, state, action))
    }

    if (action.type === EDIT_RUNS + '__RESOLVED') {
        const current_state_path = state.value.map(x => x['path']);
        
        const new_state = action.payload.edited_runs.reduce((result, run) => {
            const run_index = current_state_path.indexOf(run['path']);
            result[run_index] = run
            return result
        }, state.value);
        
        action.payload = new_state;

        state = Object.assign({}, state, networkStateReducer(EDIT_RUNS, state, action))
    }

    return reducer(state, action, {})
}