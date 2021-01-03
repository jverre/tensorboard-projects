import { API_DASHBOARD } from '../../lib/data_management/api_endpoints';  
import API           from "../../api";
import { redirect } from '../../lib/util/navigation';
import * as actions  from './actions';

export async function get_dashboards(action) {
    const path = {
      'name': API_DASHBOARD,
      'params': action.payload.params
    }

    const res = await API.get(path, null);
    return res.data
}

export async function create_dashboard(action) {
    const path = {
      'name': API_DASHBOARD
    }

    const res = await API.post(path, action.payload.payload);
    return res.data
}

export async function stop_dashboard(action) {
    const path = {
      'name': API_DASHBOARD,
    }
    
    const res = await API.delete(path, action.payload.payload);
    return res.data
}

export default {
    "[DASHBOARD] GET_DASHBOARDS__SUBMIT": async (store, next, action) => {
        try {
            const result = await get_dashboards(action)
            
            store.dispatch(actions.getDashboards.resolved(result));
        } catch (error) {
            store.dispatch(actions.getDashboards.rejected(error));
        }
    },
    "[DASHBOARD] CREATE_DASHBOARD__SUBMIT": async (store, next, action) => {
        try {
            const result = await create_dashboard(action)
            
            store.dispatch(actions.createDashboard.resolved(result.dashboards));
            redirect(`/dashboards/${result.dashboard_id}`)
        } catch (error) {
            store.dispatch(actions.createDashboard.rejected(error));
        }
    },
    "[DASHBOARD] STOP_DASHBOARD__SUBMIT": async (store, next, action) => {
        try {
            const result = await stop_dashboard(action)
            store.dispatch(actions.stopDashboard.resolved(result.dashboards));
        } catch (error) {
            store.dispatch(actions.stopDashboard.rejected(error));
        }
    }
}