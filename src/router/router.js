import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Index from '../view/index/index'
import Mind from '../view/mind/mind'
import VerifyCode from '../view/verifyCode/verifyCode'

class Components extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" exact strict component={Index} ></Route>
                    <Route path="/mind" component={Mind} ></Route>
                    <Route path="/verifycode" component={VerifyCode} ></Route>
                </Switch>
            </Router>
        )
    }
}
export default Components