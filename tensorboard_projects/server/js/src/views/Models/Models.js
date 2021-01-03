import React, { Component } from 'react';
import { Breadcrumb, Card } from 'antd';
import { EditOutlined, LineChartOutlined, FileSearchOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import { redirect } from '../../lib/util/navigation';
import * as actions from './../../modules/models/actions'
import './Models.scss';
import AddModel from './Components/AddModel/AddModel';
import EditModal from './Components/EditModal/EditModal';
import { PageContainerHOC } from '../../components/PageContainer/PageContainerHOC';

const { Meta } = Card;

const mapStateToProps = state => {
  return { 
      models: state.models
  };
};

class Models extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        isEditModalVisible: false,
        model_id: '',
        modal_values: {}
    }
  }

  componentDidMount() {
    window.__store.dispatch(actions.getModels.submit());
  }

  onClickExperiments = (model_id) => {
    redirect(`/runs/${model_id}`);
  }

  onClickDocumentation = (model_id) => {
    redirect(`/documentation/${model_id}`);
  }

  handleOk = () => {
    this.setState({
      'isEditModalVisible': false
    })
  }

  handleCancel = () => {
    this.setState({
      'isEditModalVisible': false
    })
  }

  handleOk = () => {
    this.setState({
      'isEditModalVisible': false
    })
  }

  onClickEdit = (model_id) => {
    this.setState({
      'isEditModalVisible': true,
      'model_id': model_id
    })
  }

  onValuesChange = (values) => {
    this.setState({
      'modal_values': {...this.state.modal_values, ...values}
    })  
  }

  render() {
      const models = this.props.models.value;
      const pathname = this.props.location.pathname.substring(1);
      
      return (
        <div className="home-page">
          <Breadcrumb className="page-breadcrumb">
              <Breadcrumb.Item style={{'textTransform': 'capitalize'}}>{pathname}</Breadcrumb.Item>
          </Breadcrumb>
          <div className="projects__wrapper">
            <div className="projects">
              {models.map((project, index) => {
                const model_name = project.model_name || project.model_id;
                const model_id = project.model_id;

                let actions = [];
                if (pathname === 'documentation') {
                  actions = [
                    <div onClick={() => this.onClickDocumentation(model_id)}><FileSearchOutlined key='documentation'/> View documentation</div>,
                    <EditOutlined key="edit" onClick={() => this.onClickEdit(project.model_id)}/>,
                  ]
                } else if (pathname === 'runs') {
                  actions = [
                    <div onClick={() => this.onClickExperiments(model_id)}><LineChartOutlined key="dashboard"/> View runs</div>,
                    <EditOutlined key="edit" onClick={() => this.onClickEdit(project.model_id)}/>,
                  ]
                }

                return (
                  <Card
                    key={index}
                    style={{ width: 300 }}
                    className="card card__model"
                    actions={actions}
                  >
                    <Meta
                      title={model_name}
                      description={project.description || ' '}
                    />
                  </Card>)})}
                  <AddModel />
                  <EditModal
                    handleCancel={this.handleCancel}
                    handleOk={this.handleOk}
                    isEditModalVisible={this.state.isEditModalVisible}
                    model_id={this.state.model_id}
                    modelMetadata={this.props.models.value.filter(x => x.model_id === this.state.model_id)[0]}/>
              </div>
          </div>
        </div>
      )
  }
}

export default connect(mapStateToProps)(PageContainerHOC(Models));