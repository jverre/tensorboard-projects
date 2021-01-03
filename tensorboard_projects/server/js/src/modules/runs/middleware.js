import { API_RUNS } from './../../lib/data_management/api_endpoints';  
import API           from "./../../api";
import * as actions  from './actions';

export async function get_runs(action) {
    var path = {
      'name': API_RUNS,
      'params': action.payload.params
    }
    
    const res = await API.get(path);
    return res.data
}

export async function archive_runs(action) {
    var path = {
      'name': API_RUNS,
      'params': action.payload.params
    }
    
    const res = await API.post(path, {'action': 'archive', ...action.payload.payload});
    return res.data
}

export async function unarchive_runs(action) {
    var path = {
      'name': API_RUNS,
      'params': action.payload.params
    }
    
    const res = await API.post(path, {'action': 'unarchive', ...action.payload.payload});
    return res.data
}

export async function delete_runs(action) {
    var path = {
      'name': API_RUNS,
      'params': action.payload.params
    }
    
    const res = await API.post(path, {'action': 'delete', ...action.payload.payload});
    return res.data
}

export async function edit_runs(action) {
    var path = {
      'name': API_RUNS,
      'params': action.payload.params
    }
    
    const res = await API.post(path, {'action': 'edit', ...action.payload.payload});
    return res.data
}

const runsMiddleware = {
    "[RUNS] GET_RUNS__SUBMIT": async (store, next, action) => {
        try {
            const result = await get_runs(action)
            
            store.dispatch(actions.getRuns.resolved(result));
        } catch (error) {
            store.dispatch(actions.getRuns.rejected(error));
        }
    },
    "[RUNS] ARCHIVE_RUNS__SUBMIT": async (store, next, action) => {
        try {
            const result = await archive_runs(action);
            store.dispatch(actions.archiveRuns.resolved(result));
        } catch (error) {
            store.dispatch(actions.archiveRuns.rejected(error));
        }
    },
    "[RUNS] UNARCHIVE_RUNS__SUBMIT": async (store, next, action) => {
        try {
            const result = await unarchive_runs(action);
            store.dispatch(actions.unarchiveRuns.resolved(result));
        } catch (error) {
            store.dispatch(actions.unarchiveRuns.rejected(error));
        }
    },
    "[RUNS] DELETE_RUNS__SUBMIT": async (store, next, action) => {
        try {
            const result = await delete_runs(action);
            store.dispatch(actions.deleteRuns.resolved(result));
        } catch (error) {
            store.dispatch(actions.deleteRuns.rejected(error));
        }
    },
    "[RUNS] EDIT_RUNS__SUBMIT": async (store, next, action) => {
        try {
            const result = await edit_runs(action);
            store.dispatch(actions.editRuns.resolved(result));
        } catch (error) {
            store.dispatch(actions.editRuns.rejected(error));
        }
    }
}

export default runsMiddleware;