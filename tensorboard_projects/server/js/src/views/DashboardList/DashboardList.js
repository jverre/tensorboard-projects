import React, { Component } from 'react';
import { Breadcrumb, Table, Button, Popconfirm } from 'antd';
import { connect } from "react-redux";
import * as moment from 'moment';
import { PageContainerHOC } from '../../components/PageContainer/PageContainerHOC';
import { redirect } from '../../lib/util/navigation';
import { getModelName } from '../../lib/util/util';
import * as dashboard_actions from '../../modules/dashboards/actions';
import * as model_actions from '../../modules/models/actions';
import './DashboardList.scss';

const mapStateToProps = state => {
    return { 
        dashboards: state.dashboards,
        models: state.models.value
    };
};

class DashboardList extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const payload = {
            params: {}
        }
        window.__store.dispatch(model_actions.getModels.submit(payload));
        window.__store.dispatch(dashboard_actions.getDashboards.submit(payload));
    }

    redirectDashboards = () => {
        redirect('/dashboards');
    }

    onOpenDashboard = (dashboard_id) => {
        redirect(`/dashboards/${dashboard_id}`);
    }

    stopDashboard = (dashboard_id) => {
        const payload = {
            params: {},
            payload: {
                dashboardId: dashboard_id
            }
        }
        window.__store.dispatch(dashboard_actions.stopDashboard.submit(payload));
    }

    cancel = () => {
        
    }

    render() {
        const table_data = this.props.dashboards.value.map(x => {return {...x, key: x.dashboard_id, model_name: getModelName(this.props.models, x.model_id)}})
        
        const columns = [
            {
              title: 'Created At',
              dataIndex: 'created_at',
              key: 'created_at',
              defaultSortOrder: 'descend',
              render: name => `${moment(name.created_at).format('LLL')}`,
              sorter: (a, b) => a.created_at > b.created_at,
            },
            {
                title: 'Model Name',
                dataIndex: 'model_name',
                key: 'model_name',
                //defaultSortOrder: 'descend',
                sorter: (a, b) => a.model_name > b.model_name,
            },
            {
                title: '',
                key: 'action',
                width: 250,
                render: (text, record) => (
                  <span style={{display: 'flex'}}>
                    <Button style={{'marginRight': '10px'}} onClick={() => this.onOpenDashboard(record.dashboard_id)}>Open Dashboard</Button>
                    <Popconfirm
                        title="Are you sure stop this dashboard?"
                        onConfirm={() => this.stopDashboard(record.dashboard_id)}
                        onCancel={this.cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="danger" >Stop</Button>
                    </Popconfirm>
                </span>
                ),
              }
        ];

        return (
            <div className="dashboards-page">
                <div className='dashboards-header'>
                    <Breadcrumb className="page-breadcrumb">
                        <Breadcrumb.Item onClick={this.redirectDashboards}>Dashboards</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="site-layout-content">
                    <Table
                        loading={this.props.dashboards.pending}
                        // rowSelection={rowSelection}
                        dataSource={table_data}
                        columns={columns}
                        style={{'width': '100%'}}
                        pagination={{ pageSize: 50 }}/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(PageContainerHOC(DashboardList));
