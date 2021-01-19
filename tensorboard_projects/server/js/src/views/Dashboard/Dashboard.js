import React, { Component } from 'react';
import { Result, Button, Typography, Spin } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import * as dashboard_actions from '../../modules/dashboards/actions';
import './Dashboard.scss';
import { PageContainerHOC } from '../../components/PageContainer/PageContainerHOC';
import { redirect } from '../../lib/util/navigation';

const { Paragraph, Text } = Typography;

const mapStateToProps = state => {
    return { 
        runs: state.runs,
        models: state.models,
        dashboards: state.dashboards
    };
};

class Dashboard extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            loadedDashboard: false
        }
    }
    
    componentDidMount() {
        const payload = {
            params: {},
        }

        window.__store.dispatch(dashboard_actions.getDashboards.submit(payload));
    }
    updateDashboardLoadState = (val) => {
        this.setState({'loadedDashboard': val})
    }

    onClickReturnToDashboard = () => {
        redirect('/dashboards')
    }

    render() {
        const dashboardId = this.props.match.params.dashboardId;
        const dashboard_list = this.props.dashboards.value.filter(x => x.dashboard_id === dashboardId);
        console.log(this.props.dashboards.value)
        console.log(dashboardId)

        let path = null;
        let error = null;
        let dashboardNotFound = false;
        if (dashboard_list.length > 0) {
            if (dashboard_list[0].error) {
                error = dashboard_list[0].error
            }
            path = dashboard_list[0].path;
        } else {
            dashboardNotFound = true
        }
        
        if (error) {
            return (
                <div className="dashboard-page">
                    <div className="dashboard__missing">
                        <Result
                            status="error"
                            title="Failed to start dashboard"
                            subTitle="Please check the error message below."
                        >
                            <div className="desc">
                                <Paragraph>
                                    <Text
                                        strong
                                        style={{
                                            fontSize: 16,
                                        }}
                                    >
                                        When starting the TensorBoard dashboard, the following error was encountered:
                                    </Text>
                                </Paragraph>
                                <Paragraph>
                                    <CloseCircleOutlined className="site-result-demo-error-icon" /> {error}
                                </Paragraph>
                            </div>
                        </Result>
                    </div>
                </div>
            )
        } else if (dashboardNotFound) {
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
                    {this.state.loadedDashboard == false ? 
                        <div className='dashboard-loading-spinner'>
                            <Spin size="large" />
                        </div> : null}
                    <iframe title='tensorbard-dashboard' src={path} onLoad={() => {this.updateDashboardLoadState(true)}} />
                </div>
            )
        }
    }
}

export default connect(mapStateToProps)(PageContainerHOC(Dashboard));
