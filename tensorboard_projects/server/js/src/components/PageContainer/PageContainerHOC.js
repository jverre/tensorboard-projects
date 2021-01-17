import React from 'react';
import { Layout, Menu } from 'antd';
import './PageContainerHOC.scss';
  import { LineChartOutlined } from '@ant-design/icons';
import { redirect, sectionForRoute } from '../../lib/util/navigation';

const { Content, Sider } = Layout;

export function PageContainerHOC(WrappedComponent) {
    return class extends React.Component {
        state = {
            collapsed: false,
        };
        
        onCollapse = collapsed => {
            this.setState({ collapsed });
        };
        
        onClickDashboards = () => {
            redirect('/dashboards')
        }

        onClickRuns = () => {
            redirect('/runs')
        }

        render() {
            const { collapsed } = this.state;
            const section = sectionForRoute(this.props.location.pathname);

            let selected_key = [];
            if (section === 'runs') {
                selected_key = ['1'];
            } else if (section ==='dashboards') {
                selected_key = ['2'];
            }
            
            return (
                <Layout>
                    <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={this.onCollapse}
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'sticky',
                        top: 0,
                        left: 0
                    }}
                    >
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" selectedKeys={selected_key} defaultSelectedKeys={['1']}>
                        <Menu.Item key="1" icon={<LineChartOutlined />} onClick={this.onClickRuns}>
                            Model Runs
                        </Menu.Item><Menu.Item key="2" icon={<LineChartOutlined />} onClick={this.onClickDashboards}>
                            Dashboards
                        </Menu.Item>
                    </Menu>
                    </Sider>
                    <Layout className="site-layout">
                    <Content style={{ overflow: 'initial'}}>
                        <div className="site-layout-background" style={{ minHeight: 360, padding: '0 16px' }}>
                            {<WrappedComponent {...this.props} />}
                        </div>
                    </Content>
                    </Layout>
                </Layout>
                )
      }
    };
}