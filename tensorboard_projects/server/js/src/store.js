import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import models from './modules/models/reducers';
import runs from './modules/runs/reducers';
import dashboards from './modules/dashboards/reducers';
import {getReduxLogger} from './lib/util/config';
import thunkMiddleware from 'redux-thunk';
import middlewareRouter from './middleware';
import {createLogger} from "redux-logger";

const customMiddleWare = store => next => action => {
    middlewareRouter(store, next, action);
  };

  
// Combine Reducers
let reducers = combineReducers({
    models,
    runs,
    dashboards
});

const rootReducer = (state, action) => {
    if (action.type === '[STORE] RESET_DEFAULT') {
      state = undefined
    }
    
    return reducers(state, action)
}

let middlewares = [
    customMiddleWare,
    thunkMiddleware,
    createLogger({
        collapsed: true,
        diff     : true,
        predicate: () => getReduxLogger() === 'on',
    })
];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
var store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)));

export default window.__store = store