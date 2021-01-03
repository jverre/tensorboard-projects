import React, { Component } from 'react';
import { Result, Button } from 'antd';
import './NotFound404.scss';
import { PageContainerHOC } from '../../components/PageContainer/PageContainerHOC';
import { redirect } from '../../lib/util/navigation';

class NotFound404 extends Component {
    redirectToHome = () => {
        redirect('')
    }

    render() {
        return (
            <div className='not-found-page'>
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={<Button type="primary" onClick={this.redirectToHome}>Back Home</Button>}
                />
            </div>
        )
    }
}

export default PageContainerHOC(NotFound404);