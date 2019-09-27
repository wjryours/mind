import React from 'react'
import { List } from 'antd'
import { Link } from 'react-router-dom'
const ListData = [
    { router: '/mind', name: '思维导图' },
    { router: '/verifycode', name: '图形验证码' }
]
class Index extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        return (
            <div style={{padding:30}}>
                <List
                    header={<div>Code Example List</div>}
                    bordered
                    dataSource={ListData}
                    renderItem={item => {
                        return (
                            <List.Item>
                                <Link to={item.router} >{item.name}</Link>
                            </List.Item>
                        )
                    }}
                >

                </List>
            </div>
        )
    }
}
export default Index