import React, { Component } from 'react';
import { Modal, Button, Form, Input, Collapse, Popconfirm } from 'antd';
import * as actions from './../../../../modules/models/actions'
import { connect } from "react-redux";
import './EditModal.scss';

const { Panel } = Collapse;

const mapStateToProps = state => {
    return { 
        models: state.models.value
    };
};

class EditModal extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            'model_id': this.props.model_id,
            modal_values: {
                'model_name': '',
                'path': '',
                'description': ''
            }
        }
    }
    
    componentWillUpdate(nextProps) {
        if (nextProps.model_id !== this.props.model_id) {
            const modelMetadata = nextProps.models.filter(x => x.model_id === nextProps.model_id)[0];
            this.setState({
                'model_id': nextProps.model_id,
                'modal_values': modelMetadata
            })
        }
    }

    cancelDeleteModel = () => {
    }

    deleteModel = () => {
        const payload = {
            params: {
                modelId: this.state.model_id
            },
        }
        window.__store.dispatch(actions.deleteModel.submit(payload));
        
        // Reset state
        this.props.handleOk()
    }

    handleOk = () => {
        const modelId = this.state.model_id;
        const payload = {
            params: {
                modelId: modelId
            },
            payload: {...this.state.modal_values, model_id: modelId}
        }
        window.__store.dispatch(actions.addEditModel.submit(payload));
        this.props.handleOk();
    }

    handleCancel = () => {
        this.setState({
            'model_id': '',
            'modal_values': {
                'model_name': '',
                'path': '',
                'description': ''
            }
        })

        this.props.handleCancel()
    }

    onValuesChange = (values) => {
        this.setState({
          'modal_values': {...this.state.modal_values, ...values}
        })  
    }
    
    render() {
        const layout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        };
        const loading = false;

        if (this.props.isEditModalVisible) {
            return (
                <>
                    )
                    <Modal
                        title={"Edit "}
                        className="model__edit_model"
                        visible={this.props.isEditModalVisible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="back" onClick={this.handleCancel}>
                                Cancel
                            </Button>,
                            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                                Submit
                            </Button>,
                        ]}>
                        <Form
                            {...layout}
                            name='basic'
                            onValuesChange={this.onValuesChange}
                            initialValues={
                                {...this.props.modelMetadata}
                            }
                        >
                            <Form.Item label="Model Name" name='model_name' >
                                <Input placeholder="input placeholder"/>
                            </Form.Item>
                            <Form.Item label="Description" name='description'>
                                <Input placeholder="Model description" />
                            </Form.Item>
                            <Form.Item label="Path" name='path'>
                                <Input placeholder="Path for Tensorboard runs" />
                            </Form.Item>
                        </Form>
                        <Collapse defaultActiveKey={[]} ghost>
                            <Panel header="Advanced" key="1">
                                <div className="delete__button">
                                <Popconfirm
                                    title="Are you sure to delete this model?"
                                    onConfirm={this.deleteModel}
                                    onCancel={this.cancelDeleteModel}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type="primary" danger>
                                        Delete model
                                    </Button>
                                </Popconfirm>
                                    
                                    
                                </div>
                            </Panel>
                        </Collapse>
                        
                    </Modal>
                </>
            )
        } else {return (<></>)}
  }
}

export default connect(mapStateToProps)(EditModal);