import Models from './modules/models/middleware';
import Documentation from './modules/documentation/middleware';
import Runs from './modules/runs/middleware';
import Tensorboard from './modules/dashboards/middleware';

const middlewares = {
  ...Models,
  ...Documentation,
  ...Runs,
  ...Tensorboard,
};

const midleware = (store, next, action) => {
  let middleware = middlewares[action.type];

  if (middleware) {
    try {
      middleware(store, next, action);
    } catch (e) {
      //console.error(e);
    }
  }
  
  next(action);
};

export default midleware;