/// <reference path="../../../../../../../typings-module/react-draggable.d.ts" />

import * as React from 'react'
import connect from '../../utils/connect'
import * as module from './module'
import * as actions from '../../stores/actions'
import * as Draggable from 'react-draggable'
import {unSelectLastTree} from '../../object-store/dom-tree'
import {Tabs, TabPanel} from '../../../../../tabs/src'
import './index.scss'

import Basic from './basic'
import Event from './event'
import Script from './script'

export type DraggableData = {
    node: HTMLElement,
    // lastX + deltaX === x
    x: number, y: number,
    deltaX: number, deltaY: number,
    lastX: number, lastY: number
}

@connect(
    (state: any) => {
        return {
            editBox: state.editBox.toJS(),
            section: state.section.toJS()
        }
    },
    actions
)
export default class EditBox extends React.Component <module.PropsInterface, module.StateInterface> {
    static defaultProps: module.PropsInterface = new module.Props()
    public state: module.StateInterface = new module.State()
    private offsetX: number = 0
    private offsetY: number = 0

    shouldComponentUpdate(nextProps: module.PropsInterface) {
        if (nextProps.editBox.isNewInstance || nextProps.editBox.show !== this.props.editBox.show) {
            // 如果 isNewInstance === true
            // 立即设置为 false
            if (nextProps.editBox.isNewInstance === true) {
                this.props.editBoxSetIsNew(false)
            }

            return true
        }
        return false
    }

    componentWillReceiveProps() {
        if (this.state.offsetLeft === -1) {
            // 初始状态放在右侧
            this.offsetX = this.props.section.width ? this.props.section.width - 400 : -1

            if (this.props.section.width && this.offsetX < 0) {
                this.offsetX = 0
            }

            this.setState({
                offsetLeft: this.offsetX,
                offsetTop: this.offsetY
            })
        } else {
            this.setState({
                offsetLeft: this.offsetX,
                offsetTop: this.offsetY
            })
        }
    }

    /**
     * 关闭
     */
    handleCloseClick() {
        this.props.editBoxClose()
        // 通知取消选择最后一个选择的 tree
        unSelectLastTree()
    }

    /**
     * 编辑框被拖拽
     */
    handleDrag(event: any, data: DraggableData) {
        this.offsetX = data.x
        this.offsetY = data.y

        if (this.offsetX > this.props.section.width - 400) {
            this.offsetX = this.props.section.width - 400
        }
        if (this.offsetY > this.props.section.height - 550) {
            this.offsetY = this.props.section.height - 550
        }
        if (this.offsetX < 0) {
            this.offsetX = 0
        }
        if (this.offsetY < 0) {
            this.offsetY = 0
        }
    }

    render() {
        if (!this.props.editBox.show)return null

        const bounds = {
            left: 0,
            top: 0,
            right: this.props.section.width - 400,
            bottom: this.props.section.height - 550
        }

        const position = {
            x: this.state.offsetLeft,
            y: this.state.offsetTop
        }

        return (
            <Draggable handle=".title-container"
                       bounds={bounds}
                       onDrag={this.handleDrag.bind(this)}
                       defaultPosition={position}>
                <div className="_namespace handle-drag">
                    <div className="container-box">
                        <span className="handle-drag-close"
                              onClick={this.handleCloseClick.bind(this)}>x</span>

                        <Tabs defaultActiveKey="basic"
                              type="retro"
                              className="_namespace edit-box-handle">
                            <TabPanel tab="基础"
                                      key="basic"
                                      className="edit-container">
                                <Basic mergedProps={this.props.editBox.mergedProps}
                                       isRoot={this.props.editBox.isRoot}
                                       positions={this.props.editBox.positions}/>
                            </TabPanel>
                            <TabPanel tab="事件"
                                      key="event"
                                      className="edit-container">
                                <Event/>
                            </TabPanel>
                            <TabPanel tab="脚本"
                                      key="script"
                                      className="edit-container">
                                <Script/>
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
            </Draggable>
        )
    }
}