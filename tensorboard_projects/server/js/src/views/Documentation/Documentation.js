import React, { Component } from 'react';
import { Layout, Breadcrumb, Button } from 'antd';
import { connect } from "react-redux";
//import { redirect } from '../../lib/util/navigation';
import BraftEditor from 'braft-editor';
import * as actions from './../../modules/documentation/actions'
import DocumentationTabs from './Components/DocumentationTabs';
import 'braft-editor/dist/index.css';
import './Documentation.scss';
import { PageContainerHOC } from '../../components/PageContainer/PageContainerHOC';
import { redirect } from '../../lib/util/navigation';

const mapStateToProps = state => {
    return { 
        documentation: state.documentation,
        models: state.models.value
    };
};

class Documentation extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            editorOpen: false,
            documentationSummary: null,
            activeTabKey: null,
            documentationPanes: []
        }
    }

    componentDidUpdate(nextProps) {
        const documentationSummary = this.props.documentation.value.documentation_summary;
        const nextDocumentationSummary = nextProps.documentation.value.documentation_summary;
        
        const documentationPanes = this.props.documentation.value.documentation_panes;
        const nextDocumentationPanes = nextProps.documentation.value.documentation_panes;
        
        if (nextDocumentationSummary !== documentationSummary) {
            this.setState({ documentationSummary })
        }
        if (nextDocumentationPanes !== documentationPanes) {
            this.setState({ documentationPanes })
        }
    }
    
    redirectDocumentation = () => {
        redirect('/documentation')
    }

    componentDidMount() {
        const payload = {
            'params': {
                'modelId': this.props.match.params.modelId
            }
        }
        window.__store.dispatch(actions.getDocumentation.submit(payload));
    }

    submitContent = () => {
        this.setState({'editorOpen': !this.state.editorOpen});

        const payload = {
            'params': {
                'modelId': this.props.match.params.modelId
            },
            'payload': {
                documentation_summary: this.state.documentationSummary,
                documentation_panes: this.state.documentationPanes
            }
        }
        window.__store.dispatch(actions.postDocumentation.submit(payload));
    }

    handleSummaryChange = (editorState) => {
        if (this.state.documentationSummary !== editorState.toHTML()) {
            this.setState({ 'documentationSummary': editorState.toHTML() });
        }
    }
    
    handleTabChange = (editorState) => {
        const activeTabKey = this.state.activeTabKey;
        const newDocumentationPanes = this.state.documentationPanes;
        let updatePanes = false;

        newDocumentationPanes.forEach((pane, i) => {
            if (pane.key === activeTabKey && pane.content !== editorState.toHTML()) {
                pane.content = editorState.toHTML()
                updatePanes = true;
            }
        });
        if (updatePanes) {
            this.setState({
                'documentationPanes': newDocumentationPanes
            })
        }
        
    }

    onOpenEditor = () => {
        this.setState({'editorOpen': true});
    }

    onCloseEditor = () => {
        this.setState({'editorOpen': false});
    }

    onChangeTab = (activeKey) => {
        this.setState({ 'activeTabKey': activeKey });
    }
    
    addTab = (titleNewTab) => {
        const { documentationPanes } = this.state;
        const activeKey = `${documentationPanes.length + 1}`;
        const newPanes = [...documentationPanes];
        newPanes.push({ title: titleNewTab, content: '', key: activeKey});
        
        this.setState({
            'documentationPanes': newPanes,
            'activeTabKey': activeKey
        });
    }

    deleteTab = (tabDeleteKey) => {
        const { documentationPanes } = this.state;
        const newDocumentationPanes = documentationPanes.filter(x => x.key !== tabDeleteKey);

        const payload = {
            'params': {
                'modelId': this.props.match.params.modelId
            },
            'payload': {
                documentation_summary: this.state.documentationSummary,
                documentation_panes: newDocumentationPanes
            }
        }
        window.__store.dispatch(actions.postDocumentation.submit(payload));
    }

    getSelectedPane = (panes, activeKey) => {
        const selected_pane = panes.filter(pane => pane.key === activeKey);
        
        if (selected_pane.length === 1) {
            return selected_pane[0]
        } else {
            return null
        }
    }
    
    render() {
        const modelId = this.props.match.params.modelId;
        const editorOpen = this.state.editorOpen;
        const documentation_summary = this.state.documentationSummary;
        const documentation_panes = this.state.documentationPanes;
        
        const modelName = this.props.documentation.value.documentation_metadata.model_name || modelId;

        return (
            <div className='documentation'>
                <div className='documentation-header'>
                    <Breadcrumb className="page-breadcrumb">
                        <Breadcrumb.Item onClick={this.redirectDocumentation}>Documentation</Breadcrumb.Item>
                        <Breadcrumb.Item>{modelName}</Breadcrumb.Item>
                    </Breadcrumb>
                    {editorOpen ? <Button type="primary" onClick={this.submitContent}>Save</Button> : <Button type="primary" onClick={this.onOpenEditor}>Edit</Button>}
                </div>
                <div className="documentation-summary">
                    <h3 style={{'paddingLeft': '15px', 'paddingTop': '5px'}}><b>Model summary</b></h3>
                { editorOpen ? <BraftEditor
                    media={{image: true, video: false, audio:false, accepts: {video: false, audio: false}}}
                    excludeControls={['letter-spacing', 'fullscreen', 'clear']}
                    language="en"
                    //value={BraftEditor.createEditorState(documentation_summary)}
                    onChange={this.handleSummaryChange}
                /> : <BraftEditor
                        readOnly={true}
                        controls={[]}
                        value={BraftEditor.createEditorState(documentation_summary)}
                />
                }
                </div>
                <DocumentationTabs 
                    panes={documentation_panes}
                    activeKey={this.state.activeTabKey}
                    editorOpen={this.state.editorOpen}
                    handleTabChange={this.handleTabChange}
                    addTab={this.addTab}
                    deleteTab={this.deleteTab}
                    onChangeTab={this.onChangeTab}/>
                <div className="documentation-footer">
                {editorOpen ? <Button type="primary" onClick={this.submitContent}>Save</Button> : null}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(PageContainerHOC(Documentation));
