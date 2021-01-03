import moment from "moment";

export function actionCreator(type) {
    return payload => {
      return {
        type,
        payload
      };
    };
  }

export function networkActionCreators(type) {
    return {
      submit  : actionCreator(`${type}__SUBMIT`),
      resolved: actionCreator(`${type}__RESOLVED`),
      rejected: actionCreator(`${type}__REJECTED`),
      reset: actionCreator(`${type}__RESET`)
    };
  }

  export function networkStateReducer(type, state, action) {
    switch (action.type) {
      case `${type}__SUBMIT`:
        return {
          ...state,
          error   : null,
          //value   : state.defaultValue,
          pending : true,//!!action.payload,
          //resolved: false,
          rejected: false
        };
      case `${type}__RESOLVED`:
        return {
          ...state,
          value   : action.payload !== undefined ? action.payload: state.value,
          error   : null,
          pending : false,
          resolved: true,
          rejected: false,
          lastUpdated: moment().valueOf()
        };
      case `${type}__REJECTED`:
        if (action.payload && action.payload.message && action.payload.message.includes('Operation cancelled by the user')) {
            return state
        }
        return {
          ...state,
          //value   : state.defaultValue,
          error   : action.payload,
          pending : false,
          //resolved: false,
          rejected: true
        };
      case `${type}__RESET`:
        return {
          ...state,
          value   : state.defaultValue,
          error   : null,
          pending : false,
          resolved: false,
          rejected: false,
          lastUpdated: null
        };
      default:
        return state;
    }
  }

export function reducer(state, action, map) {
  if (action.type in map) {
    return map[action.type]();
  }
  return state;
}