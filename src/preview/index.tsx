/// <reference path="../../../../../typings-module/wolfy87-eventemitter.d.ts" />
import * as EventEmitter from 'wolfy87-eventemitter'
import * as React from 'react'
import * as module from './module'
import './index.scss'

const event = new EventEmitter()

export default class Preview extends React.Component <module.PropsInterface, module.StateInterface> {
    static defaultProps: module.PropsInterface = new module.Props()
    public state: module.StateInterface = new module.State()

    /**
     * 通过 id 寻找组件
     */
    getComponentById(){

    }

    render() {
        return (
            <div className="_namespace">
                
            </div>
        )
    }
}