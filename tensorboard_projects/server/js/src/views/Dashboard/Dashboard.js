import React, { Component } from 'react';
import { Result, Button } from 'antd';
import { connect } from "react-redux";
import * as dashboard_actions from '../../modules/dashboards/actions';
import './Dashboard.scss';
import { PageContainerHOC } from '../../components/PageContainer/PageContainerHOC';
import { redirect } from '../../lib/util/navigation';

const mapStateToProps = state => {
    return { 
        runs: state.runs,
        models: state.models,
        dashboards: state.dashboards
    };
};

class Dashboard extends Component {
   componentDidMount() {
        const payload = {
            params: {}
        }

        window.__store.dispatch(dashboard_actions.getDashboards.submit(payload));
    }

    onClickReturnToDashboard = () => {
        redirect('/dashboards')
    }

    render() {
        const dashboard = this.props.dashboards.value.filter(x => x.dashboard_id === this.props.match.params.dashboardId);

        let path = null;
        let dashboardNotFound = false;
        if (dashboard.length > 0) {
            path= dashboard[0].path
        } else {
            dashboardNotFound = true
        }

        if (dashboardNotFound) {
            return (
                <div className="dashboard-page">
                    <div className="dashboard__missing">
                        <Result
                            title="Dashboard does not exist"
                            extra={
                            <Button key="return" type="primary" onClick={() => this.onClickReturnToDashboard()}>
                                Go to dashboards
                            </Button>
                            }
                        />
                    </div>
                </div>
                
            )
        } else {
            return (
                <div className="dashboard-page">
                    <iframe title='tensorbard-dashboard' src={path} />
                </div>
            )
        }
        
    }
}

export default connect(mapStateToProps)(PageContainerHOC(Dashboard));
