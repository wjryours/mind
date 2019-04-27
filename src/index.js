import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import * as serviceWorker from './serviceWorker'
import 'react-app-polyfill/ie9'
import Mind from './view/mind/mind'
ReactDOM.render(  
    <LocaleProvider locale={zh_CN}>
        <Mind></Mind>
    </LocaleProvider>      
, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
