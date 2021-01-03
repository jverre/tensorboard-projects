import React, { Component } from 'react';
import { Card, Modal, Button, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import * as actions from './../../../../modules/models/actions'
import './AddModel.scss';
import { uuid } from 'uuidv4';

const { Meta } = Card;

class AddModel extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            isModalVisible: false,
            modal_values: {
                'model_name': '',
                'path': '',
                'description': ''
            }
        }
    }

    onClickAddModel = () => {
        this.setState({isModalVisible: true});
    }

    handleCancel = () => {
        this.setState({isModalVisible: false})
    }

    handleOk = () => {
        const modelId = uuid();

        const payload = {
            params: {
                modelId: modelId
            },
            payload: {...this.state.modal_values, model_id: modelId}
        }
        window.__store.dispatch(actions.addEditModel.submit(payload));
        this.setState({
            isModalVisible: false,
            modal_values: {
                'model_name': '',
                'path': '',
                'description': ''
            }
        })
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
        
        return (
            <>
                <Card
                    key={'add-model'}
                    style={{ width: 300 }}
                    className="card"
                    actions={[
                        <PlusOutlined key="add-model" onClick={() => this.onClickAddModel()}/>,
                    ]}
                    >
                    <Meta
                        title={'New model'}
                        description={'You can add any model being tracked using Tensorboard'}
                    />
                </Card>
                <Modal
                    title={"Add new model"}
                    visible={this.state.isModalVisible}
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
                    >
                        <Form.Item label="model_name" name='model_name'>
                            <Input placeholder="Model name" />
                        </Form.Item>
                        <Form.Item label="path" name='path'>
                            <Input placeholder="Path of tensorboard runs, example: /path/mnist_model/logs/{model_version}" />
                        </Form.Item>
                        <Form.Item label="Description" name='description'>
                            <Input placeholder="Model description" />
                        </Form.Item>
                    </Form>
                </Modal>
            </>
      )
  }
}

export default AddModel;