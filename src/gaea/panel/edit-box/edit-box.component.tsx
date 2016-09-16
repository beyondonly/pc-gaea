/// <reference path="../../../../../../../typings-module/react-draggable.d.ts" />

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as typings from './edit-box.type'
import {observer, inject} from 'mobx-react'

import {autoBindMethod} from '../../../../../../common/auto-bind/src'
import {Tabs, TabPanel} from '../../../../../tabs/src'

import Basic from './basic/basic.component'
import Event from './event/event.component'
import Script from './script/script.component'

import './edit-box.scss'

@inject('application', 'viewport') @observer
export default class EditBox extends React.Component <typings.PropsDefine, typings.StateDefine> {
    static defaultProps: typings.PropsDefine = new typings.Props()
    public state: typings.StateDefine = new typings.State()

    private domInstance: Element

    componentDidMount() {
        this.domInstance = ReactDOM.findDOMNode(this)
    }

    /**
     * 点击关闭按钮
     */
    @autoBindMethod handleCloseClick() {
        this.props.viewport.cancelEditComponent()
    }

    render() {
        if (this.props.viewport.currentEditComponentMapUniqueKey === null) {
            return null
        }

        return (
            <div className="_namespace container-box">
                        <span className="handle-drag-close"
                              onClick={this.handleCloseClick}>x</span>

                <Tabs defaultActiveKey="basic"
                      type="retro"
                      className="edit-box-handle">
                    <TabPanel tab="基础"
                              activeKey="basic"
                              className="edit-container">
                        <Basic/>
                    </TabPanel>
                    <TabPanel tab="脚本"
                              activeKey="script"
                              className="edit-container">
                        <Script/>
                    </TabPanel>
                </Tabs>
            </div>
        )
    }
}