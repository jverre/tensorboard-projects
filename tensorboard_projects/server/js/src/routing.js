import Home from "./views/Home/Home";
import Runs from "./views/Runs/Runs";
import Dashboard from "./views/Dashboard/Dashboard";
import DashboardList from "./views/DashboardList/DashboardList";
import {getBasePath} from "./lib/util/config";
import Models from "./views/Models/Models";
import NotFound404 from "./views/NotFound404/NotFound404";

const basePath = getBasePath();

export const routerConfig = {
    name: 'Tensorboard Projects',
    routes: [
      {path: `${basePath}/`                        , exact: true, section: ''             , component: Home},
      {path: `${basePath}/runs/`                   , exact: true, section: 'runs'         , component: Models},
      {path: `${basePath}/runs/:modelId`           , exact: true, section: 'runs'         , component: Runs},
      {path: `${basePath}/dashboards`              , exact: true, section: 'dashboards'   , component: DashboardList},
      {path: `${basePath}/dashboards/:dashboardId` , exact: true, section: 'dashboards'   , component: Dashboard},
      {path: `*`                                   , exact: true, section: ''             , component: NotFound404}
    ]
  };