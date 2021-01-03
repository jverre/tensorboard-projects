// @flow
import React from "react";
import {Route as RouteComponent, Router, Switch} from "react-router-dom";
import { getBasePath } from './config';
import * as historyPackage from "history";

export function getHistory() {
    return window.__history;
}

export function redirect(options) {
  const base_path = getBasePath();
  
  if (options.startsWith('/')) {
    options = options.substr(1)
  }
  options = base_path + '/' + options
  getHistory().push(options);
}


export function isRouteForPath(route, path) {
  if (path.startsWith('/')) {
    path = path.substr(1);
  }
  path          = path.split('#')[0];
  let otherPath = route.path;
  if (otherPath.startsWith('/')) {
    otherPath = otherPath.substr(1);
  }
  let parts      = path.split('/');
  let otherParts = otherPath.split('/');

  return otherParts.every((otherPart, index) => {
    let part = parts[index];
    if (otherPart === undefined) {
      return false;
    }
    return part === otherPart || otherPart.startsWith(":") || otherPart === '*';
  });
}

export function getRouteForPath(path) {
  let index = getHistory()._config.routes.findIndex(otherRoute => isRouteForPath(otherRoute, path));
  
  return getHistory()._config.routes[index];
}

export function getCurrentRoute() {
  return getRouteForPath(window.location.pathname);
}

function routeInit(history, location) {
  if (!location) {
    location = window.location;
  }
  let route      = getRouteForPath(location.pathname);
  
  return route;
}

function createHistory(config) {
  
    const history = historyPackage.createBrowserHistory();
    history._config = config;
  
    window.__history = history;
    
    routeInit(history);
    history.listen(location => {
      if (location.href === window.location.href) return;
    });
    return history;
}

export function sectionForRoute(path) {
  let route = getRouteForPath(path);
  
  return route && route.section;
}

export function updateRoute(path) {
  var history = getHistory();
  
  history.push(path)
}

function renderRoutes(config) {
  return <Switch>
    {config.routes.map(route => {
      return <RouteComponent
        key={route.path}
        path={route.path}
        exact={route.exact}
        component={route.component}
      />;
    })}
  </Switch>;
}

export function createRouter(config) {
    return (props) => {
      let history = getHistory();
      if (!history) {
        history = createHistory(config);
      }
      
      let children    = props.children(renderRoutes(config));
      return <Router baseName={"/"} history={history}>{children}</Router>;
    };
  }
