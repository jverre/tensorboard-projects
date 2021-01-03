import React, { Component } from 'react';
import Provider from "react-redux/es/components/Provider";
import 'babel-polyfill';
import './App.scss';
import 'antd/dist/antd.css';
import {routerConfig} from "./routing";
import {createRouter} from "./lib/util/navigation";
import store from './store';

const Router = createRouter(routerConfig);

export default class App extends Component {
  render() {
    return (
      <>
        <Provider store={store}>
          <Router>{routes =>
            <>
              {routes}
            </>}
          </Router>
        </Provider>
      </>
    )
  }
}