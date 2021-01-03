import {networkActionCreators} from '../../lib/util/redux'

export const GET_RUNS = '[RUNS] GET_RUNS'
export const ARCHIVE_RUNS = '[RUNS] ARCHIVE_RUNS'
export const UNARCHIVE_RUNS = '[RUNS] UNARCHIVE_RUNS'
export const DELETE_RUNS = '[RUNS] DELETE_RUNS'
export const EDIT_RUNS = '[RUNS] EDIT_RUNS'

export const getRuns = networkActionCreators(GET_RUNS)
export const archiveRuns = networkActionCreators(ARCHIVE_RUNS)
export const unarchiveRuns = networkActionCreators(UNARCHIVE_RUNS)
export const deleteRuns = networkActionCreators(DELETE_RUNS)
export const editRuns = networkActionCreators(EDIT_RUNS)