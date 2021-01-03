import { GET_DOCUMENTATION } from './actions'
import {networkStateReducer, reducer} from './../../lib/util/redux'

const initialStateDocumentation = {
  value: {
    'documentation_summary': '',
    'documentation_panes': [],
    'documentation_metadata': {'model_name': null, path: null, description: null}
  },
  defaultValue: [],
  error: null,
  pending: false,
  rejected: false,
  resolved: false
};

export default function documentation(state = initialStateDocumentation, action) {
    state = Object.assign({}, state, networkStateReducer(GET_DOCUMENTATION, state, action))
    
    return reducer(state, action, {})
}