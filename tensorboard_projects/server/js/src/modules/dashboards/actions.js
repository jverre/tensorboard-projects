import {networkActionCreators} from '../../lib/util/redux'

export const GET_DASHBOARDS = '[DASHBOARD] GET_DASHBOARDS'
export const CREATE_DASHBOARD = '[DASHBOARD] CREATE_DASHBOARD'
export const STOP_DASHBOARD = '[DASHBOARD] STOP_DASHBOARD'

export const getDashboards = networkActionCreators(GET_DASHBOARDS)
export const createDashboard = networkActionCreators(CREATE_DASHBOARD)
export const stopDashboard = networkActionCreators(STOP_DASHBOARD)