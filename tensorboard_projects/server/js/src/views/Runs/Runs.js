import React, { Component } from 'react';
import { Breadcrumb, Table, Button, Menu, Dropdown, Divider, Modal } from 'antd';
import { connect } from "react-redux";
import { redirect } from '../../lib/util/navigation';
import * as actions from './../../modules/runs/actions';
import * as actions_models from './../../modules/models/actions';
import * as dashboard_actions from '../../modules/dashboards/actions';
import './Runs.scss';
import { PageContainerHOC } from '../../components/PageContainer/PageContainerHOC';
import RunDetails from './Components/RunDetails/RunDetails';
import * as moment from 'moment';
import { getModelName } from '../../lib/util/util';

const { Item } = Menu;

const mapStateToProps = state => {
    return { 
        runs: state.runs,
        models: state.models.value,
        dashboards: state.dashboards
    };
};



class Runs extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectedRows: [],
            runDetailsVisible: false,
            runDetails: {},
            archivedRuns: false,
            runsToDelete: [],
            runsToDeleteConfirm: false
        }
    }

    componentDidMount() {
        const modelId = this.props.match.params.modelId;
        const payload = {
            params: {
                modelId: modelId
            }
        }
        
        window.__store.dispatch(actions.getRuns.submit(payload));
        window.__store.dispatch(actions_models.getModels.submit(payload));
    }

    onClickArchive = (e, record) => {
        e.domEvent.stopPropagation()

        let rows = [];
        if (this.state.selectedRows.length > 0) {
            rows = this.state.selectedRows
        } else {
            rows = [record]
        }
        
        const modelId = this.props.match.params.modelId;
        const payload = {
            params: {
                modelId: modelId
            },
            payload: {
                runs: rows
            }
        }

        window.__store.dispatch(actions.archiveRuns.submit(payload));
    }

    onClickUnarchive = (e, record) => {
        e.domEvent.stopPropagation()

        let rows = [];
        if (this.state.selectedRows.length > 0) {
            rows = this.state.selectedRows
        } else {
            rows = [record]
        }
        
        const modelId = this.props.match.params.modelId;
        const payload = {
            params: {
                modelId: modelId
            },
            payload: {
                runs: rows
            }
        }

        window.__store.dispatch(actions.unarchiveRuns.submit(payload));
    }

    onClickDelete = (e, record) => {
        e.domEvent.stopPropagation()

        let rows = [];
        if (this.state.selectedRows.length > 0) {
            rows = this.state.selectedRows
        } else {
            rows = [record]
        }
        
        this.setState({
            'runsToDeleteConfirm': true,
            'runsToDelete': rows
        })
    }

    createContextMenu = (row) => {
        if (this.state.archivedRuns) {
            return (
                <Menu>
                    <Item key="archive" onClick={(e) => this.onClickUnarchive(e, row)}>Make Active</Item>
                    <Item key="active" onClick={(e) => this.onClickDelete(e, row)}>Delete</Item>
  
                </Menu>
            )
        } else {
            return (
                <Menu>
                    <Item key="archive" onClick={(e) => this.onClickArchive(e, row)}>Archive</Item>
                </Menu>
            )
        }   
    }

    startTensorboard = () => {
        const modelId = this.props.match.params.modelId;
        const payload = {
            params: {
                modelId: modelId
            },
            payload: {
                runs: this.state.selectedRows.map(x => {return {
                    'path': x.path,
                    'name': x.model_version + '/' + x.run_id
                }}),
                model_id: modelId
            }
        }
        
        window.__store.dispatch(dashboard_actions.createDashboard.submit(payload));
    }

    onChangeSelectedRows = (selectedRowKeys, selectedRows) => {
        this.setState({'selectedRows': selectedRows})
    }
    
    getCheckboxProps = (record) => {
        return {
            model_name: record.model_name,
            version_name: record.version_name,
            run_id: record.run_id,
        }
    }

    changeRunDetailsVisible = (value) => {
        this.setState({'runDetailsVisible': value});
    }
    
    onClickRow = (row) => {
        this.setState({
            'runDetailsVisible': true,
            'runDetails': row
    });
    }

    onClickRunType = (value) => {
        this.setState({
            'archivedRuns': value
        })
    }
    
    onStartCancelRuns = () => {
        this.setState({
            runsToDeleteConfirm: false,
            runsToDelete: []
        })
    }

    onDeleteRuns = () => {
        const modelId = this.props.match.params.modelId;
        const payload = {
            params: {
                modelId: modelId
            },
            payload: {
                runs: this.state.runsToDelete
            }
        }
        window.__store.dispatch(actions.deleteRuns.submit(payload));

        this.setState({
            runsToDeleteConfirm: false,
            runsToDelete: []
        });
    }

    renderTableRow = (value, row) => {
        return (
            <Dropdown overlay={this.createContextMenu(row)} trigger={[`contextMenu`]}>
                <div>{value}</div>
            </Dropdown>
        )
    }

    createTableColums = (table_data) => {
        let columns = [
            {
                title: 'Created at',
                dataIndex: 'created_at',
                key: 'created_at',
                defaultSortOrder: 'descend',
                sorter: (a, b) => a.created_at > b.created_at,
                render: (value, row) => this.renderTableRow(`${moment(value).format('Do MMM YY, HH:mm:ss')}`, row),
            },
            {
              title: 'Model Version',
              dataIndex: 'model_version',
              key: 'model_version',
              sorter: (a, b) => a.model_version > b.model_version,
              render: (value, row) => this.renderTableRow(value, row),
            },
            {
              title: 'Run ID',
              dataIndex: 'run_id',
              key: 'run_id',
              render: (value, row) => this.renderTableRow(value, row),
            },
        ];

        const mandatoryFields = ['model_name', 'model_version', 'path', 'run_id', 'created_at', 'key', 'archived'];
        let newFields = Object.keys(table_data.reduce(function(result, obj) {
            return Object.assign(result, obj);
        }, {})).filter(x => mandatoryFields.includes(x) === false).map(fieldName => {
            return {
                    title: fieldName,
                    dataIndex: fieldName,
                    key: fieldName,
                    //defaultSortOrder: 'descend',
                    sorter: (a, b) => a[fieldName] > b[fieldName],
                    render: (value, row) => this.renderTableRow(value, row),
                }
        })

        columns = columns.concat(newFields)
        return columns;
    }

    render() {
        const modelID = this.props.match.params.modelId;
        const modelName = getModelName(this.props.models, modelID);
        const table_data = this.props.runs.value.map(x => {return {...x, key: x.model_name + x.model_version + x.run_id}})
                                                .filter(x => x.archived === this.state.archivedRuns)
        const columns = this.createTableColums(table_data)
        
        return (
            <div className="runs-page">
                <div className='runs-header'>
                    <Breadcrumb className="page-breadcrumb">
                        <Breadcrumb.Item onClick={() => {redirect('/runs')}}>Runs</Breadcrumb.Item>
                        <Breadcrumb.Item>{modelName}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className='runs-selector'>
                    <span onClick={() => this.onClickRunType(false)} className={this.state.archivedRuns ? '' : 'selected'}>Active Runs</span>
                    <Divider type="vertical" />
                    <span onClick={() => this.onClickRunType(true)} className={this.state.archivedRuns ? 'selected' : ''}>Archived Runs</span>
                </div>
                <div className="site-layout-content">
                    <div  className="fixed-widget">
                        <Button
                            type="primary"
                            onClick={this.startTensorboard}
                            disabled={this.state.selectedRows.length === 0}
                            loading={this.props.dashboards.pending}>
                            Start Tensorboard
                        </Button></div>

                        <Table
                            onRow={(record, rowIndex) => {
                                return {
                                onClick: event => {this.onClickRow(record)}
                                };
                            }}
                            loading={this.props.runs.pending}
                            rowSelection={{
                                onChange: this.onChangeSelectedRows,
                                getCheckboxProps: this.getCheckboxProps,
                            }}
                            dataSource={table_data}
                            columns={columns}
                            style={{'width': '100%'}}
                            pagination={{ defaultPageSize: 50 }}
                            scroll={{x: true}}
                            size="small"
                            />
                        {this.state.runDetailsVisible ? <RunDetails 
                            visible={this.state.runDetailsVisible}
                            changeRunDetailsVisible={this.changeRunDetailsVisible}
                            runDetails={this.state.runDetails}
                            modelId={this.props.match.params.modelId}
                        /> : null}
                        {this.state.runsToDeleteConfirm ? <Modal
                            title="Delete runs"
                            visible={this.state.runsToDeleteConfirm}
                            onOk={this.onDeleteRuns}
                            onCancel={this.onStartCancelRuns}
                            okText="Delete runs"
                            cancelText="Cancel"
                            >
                            <p>Are you sure you want to delete {this.state.runsToDelete.length} run{this.state.runsToDelete.length > 1 ? 's': ''}?</p>
                            </Modal> : null}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(PageContainerHOC(Runs));