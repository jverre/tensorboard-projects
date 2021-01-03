import React, { Component } from 'react';
import { Drawer, Button, Form, Input, Col, Row } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import * as actions from './../../../../modules/runs/actions';
import * as moment from 'moment';
import './RunDetails.scss';

class RunDetails extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            runDetails: this.props.runDetails,
            newFieldName: '',
            newFieldValue: ''
        }
    }

    onCancel = () => {
        this.props.changeRunDetailsVisible(false)
    }

    onUpdate = () => {
        this.props.changeRunDetailsVisible(false);

        const modelId = this.props.modelId;
        const payload = {
            params: {
                modelId: modelId
            },
            payload: {
                runs: [this.state.runDetails]
            }
        }
        window.__store.dispatch(actions.editRuns.submit(payload));
    }

    removeField = (fieldName) => {
        const newRunDetails = this.state.runDetails;
        delete newRunDetails[fieldName]; 

        this.setState({
            runDetails: newRunDetails
        })
    }

    generateField = () => {
        const runDetails = this.state.runDetails;
        
        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        }

        // Start by rendering mandatory components
        let fields = []
        let mandatory_fields = ['model_name', 'model_version', 'path', 'run_id', 'created_at', 'key', 'archived'];

        mandatory_fields.map(fieldName => {
            if (['key', 'archived'].includes(fieldName) === false) {
                let fieldValue = runDetails[fieldName]

                if (fieldName === 'created_at') {
                    fieldValue = `${moment(fieldValue).format('Do MMM YY, HH:mm:ss')}`
                }

                fields.push(
                    <Form.Item {...layout} label={fieldName} key={fieldName} >
                        <Form.Item noStyle name={fieldName} initialValue={fieldValue}>
                            <Input style={{ width: '90%' }} disabled/>
                        </Form.Item>
                        <Button style={{width: '32px'}} disabled type="text" className="drawer__add_remove" onClick={() => this.removeField(fieldName)}>
                            <MinusCircleOutlined />
                        </Button>
                    </Form.Item>
                )

                return
            }
        })

        Object.keys(runDetails).map(fieldName => {
            if (mandatory_fields.includes(fieldName) === false) {
                let fieldValue = runDetails[fieldName]

                fields.push(
                    <Form.Item {...layout} label={fieldName} key={fieldName} >
                        <Form.Item noStyle name={fieldName} initialValue={fieldValue}>
                            <Input style={{ width: '90%' }} />
                        </Form.Item>
                        <Button style={{width: '32px'}} type="text" className="drawer__add_remove" onClick={() => this.removeField(fieldName)}>
                            <MinusCircleOutlined />
                        </Button>
                    </Form.Item>
                )
                return
            }
        })

        return fields
    }

    addField = () => {
        const newField = {};
        newField[this.state.newFieldName] = this.state.newFieldValue
        
        this.setState({
            'runDetails': {...this.state.runDetails, ...newField},
            'newFieldName': '',
            'newFieldValue': ''
        })
    }

    newField = () => {
        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        }

        let buttonActivated = false;
        if (this.state.newFieldName === '' || this.state.newFieldValue === '') {
            buttonActivated = true;
        }

        return (
            <Input.Group {...layout}>
                <Row gutter={19}>
                    <Col span={4}>
                        <Input value={this.state.newFieldName} onChange={(e) => this.changeInput(e, 'newFieldName')} />
                    </Col>
                    <Col span={15}>
                    <Input value={this.state.newFieldValue} onChange={(e) => this.changeInput(e, 'newFieldValue')} />
                    </Col>
                    <Button disabled={buttonActivated} type="text" className="drawer__add_remove" onClick={this.addField}>
                        <PlusCircleOutlined />
                    </Button>
                </Row>
            </Input.Group>
        )
    }

    onValuesChange = (values) => {
        this.setState({
            'runDetails': {...this.state.runDetails, ...values}
          })
    }

    changeInput = (e, field) => {
        let newState = {};
        newState[field] = e.target.value;
        this.setState({...newState})
    }

    render() {
        const fields = this.generateField();

        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };

        if (this.props.visible) {
            return (
                <Drawer
                    className='run-details'
                    title="Run Details"
                    width={720}
                    onClose={this.onCancel}
                    visible={this.props.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div
                        style={{
                            textAlign: 'right',
                        }}
                        >
                        <Button onClick={this.onCancel} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button onClick={this.onUpdate} type="primary">
                            Update
                        </Button>
                        </div>
                    }>
                        <Form
                            {...formItemLayoutWithOutLabel}
                            onValuesChange={this.onValuesChange}
                            >
                            {fields}
                            {this.newField()}
                        </Form>
                </Drawer>
            )
        } else {
            return null
        }
    }
}

export default RunDetails;