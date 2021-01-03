import React, { Component } from 'react';
import { Tabs, Modal, Input } from 'antd';
import BraftEditor from 'braft-editor';
import './DocumentationTabs.scss';

const { TabPane } = Tabs;

class DocumentationTabs extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            addingTab: false,
            titleNewTab: '',
            deleteTab: false,
            tabToDelete: null
        }
    }
    
    onEdit = (targetKey, action) => {
        if (action === 'add') {
            this.add(targetKey);
        } else if (action === 'remove') {
            this.remove(targetKey);
        }

        this[action](targetKey);
    };

    onChangeTitleTab = (e) => {
        this.setState({'titleNewTab': e.target.value});
    }

    add = () => {
        this.setState({addingTab: true});
    }
    
    submitNewTab = () => {
        this.props.addTab(this.state.titleNewTab);
        this.setState({addingTab: false});
    }

    submitDeleteTab = () => {
        this.props.deleteTab(this.state.tabToDelete);
        this.setState({deleteTab: false});
    }

    onCancelDeleteTab = () => {
        this.setState({
            deleteTab: false,
            titleNewTab: ''
        })
    }

    remove = targetKey => {
        this.setState({
            deleteTab: true,
            tabToDelete: targetKey
        })
    };
    
    render() {
        let activeKey = this.props.activeKey;
        if (activeKey === null && this.props.panes.length > 0) {
            activeKey = this.props.panes[0].key
        }

        let deletePaneTitle = null;
        if (this.props.panes.filter(x => x.key === this.state.tabToDelete).length > 0) {
            deletePaneTitle = this.props.panes.filter(x => x.key === this.state.tabToDelete)[0].title
        }

        return (
            <div className='documentation-tabs'>
                <Tabs
                    type="editable-card"
                    onChange={this.props.onChangeTab}
                    activeKey={activeKey}
                    onEdit={this.onEdit}
                >
                    {this.props.panes.map(pane => (
                    <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
                        { this.props.editorOpen ? <BraftEditor
                            media={{image: true, video: false, audio:false, accepts: {video: false, audio: false}}}
                            excludeControls={['letter-spacing', 'fullscreen', 'clear']}
                            language="en"
                            //value={BraftEditor.createEditorState(pane.content)}
                            onChange={this.props.handleTabChange}
                        /> : <BraftEditor
                        readOnly={true}
                        controls={[]}
                        value={BraftEditor.createEditorState(pane.content)}
                        defaultValue={BraftEditor.createEditorState(pane.content)}
                    />}
                    </TabPane>
                    ))}
                </Tabs>
                <Modal title="Adding new tab"
                       visible={this.state.addingTab}
                       onOk={this.submitNewTab}
                       onCancel={this.onCancelNewTab}>
                    <Input placeholder='Name of tab'
                           value={this.state.titleNewTab}
                           onChange={this.onChangeTitleTab}/>
                </Modal>
                <Modal title="Delete Tab"
                       visible={this.state.deleteTab}
                       onOk={this.submitDeleteTab}
                       onCancel={this.onCancelDeleteTab}
                       okText="Delete Tab"
                       cancelText="Cancel">
                        Are you sure you want to delete `{deletePaneTitle}` ?
                </Modal>
            </div>
        )
    }
}

export default DocumentationTabs;