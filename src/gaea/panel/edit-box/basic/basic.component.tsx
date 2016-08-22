import * as React from 'react'
import * as typings from './basic.type'
import {observer, inject} from 'mobx-react'

import {autoBindMethod} from '../../../../../../../common/auto-bind/src'
import {Button, ButtonGroup} from '../../../../../../button/src'
import Input from '../../../../../../input/src'

import RemoveButton from './remote-button/remote-button.component'
import SetGroupButton from './set-group-button/set-group-button.component'

import TextEditor from './edit-components/text/text.component'
import SelectEditor from './edit-components/select/select.component'

import './basic.scss'

@inject('viewport', 'application') @observer
export default class EditBoxBasic extends React.Component <typings.PropsDefine, typings.StateDefine> {
    static defaultProps: typings.PropsDefine = new typings.Props()
    public state: typings.StateDefine = new typings.State()

    // 当前编辑组件的信息
    private componentInfo: FitGaea.ViewportComponentInfo

    /**
     * 重置为默认属性
     */
    @autoBindMethod resetOptions() {
        this.props.viewport.resetComponent(this.props.viewport.currentEditComponentMapUniqueKey)
    }

    /**
     * 修改组件标题
     */
    @autoBindMethod handleChangeName(event: any) {
        this.componentInfo.props.name = event.target.value
    }

    /**
     * 给标题输入框右侧增加删除按钮
     */
    @autoBindMethod titleInputRightRender() {
        // 根组件没有移除功能
        if (this.componentInfo.parentMapUniqueKey === null) {
            return null
        }

        return (
            <RemoveButton/>
        )
    }

    render() {
        if (!this.props.viewport.currentEditComponentMapUniqueKey) {
            return null
        }

        // 绑定组件信息
        this.componentInfo = this.props.viewport.components.get(this.props.viewport.currentEditComponentMapUniqueKey)

        const Editors = this.componentInfo.props.options && Object.keys(this.componentInfo.props.options).map((optionKey, index)=> {
                const key = `${this.props.viewport.currentEditComponentMapUniqueKey}-${optionKey}`

                switch (this.componentInfo.props.options[optionKey].editor) {
                    case 'text':
                        return (
                            <TextEditor key={key}
                                        optionKey={optionKey}/>
                        )
                    case 'selector':
                        return (
                            <SelectEditor key={key}
                                          optionKey={optionKey}/>
                        )
                }
            })

        // 重置按钮,非根节点才有
        let ResetButton: React.ReactElement<any> = null
        if (this.componentInfo.parentMapUniqueKey !== null) {
            ResetButton = (
                <Button onClick={this.resetOptions}>重置为默认属性</Button>
            )
        }

        // 成组按钮,有 childs 的 layout 元素且非根节点才有
        let GroupButton: React.ReactElement<any> = null
        if (this.componentInfo.props.uniqueKey === 'gaea-layout' && this.componentInfo.parentMapUniqueKey !== null) {
            GroupButton = (
                <SetGroupButton/>
            )
        }

        return (
            <div className="_namespace">
                <div className="component-icon-container">
                    <i className={`fa fa-${this.componentInfo.props.icon}`}/>
                </div>
                <Input className="title-name"
                       label=""
                       key={this.props.viewport.currentEditComponentMapUniqueKey}
                       onChange={this.handleChangeName}
                       rightRender={this.titleInputRightRender}
                       style={{paddingLeft:35}}
                       value={this.componentInfo.props.name}/>
                <div className="edit-item-container">
                    {Editors}
                </div>
                <div className="bottom-addon">
                    <ButtonGroup>
                        {ResetButton}
                        {GroupButton}
                    </ButtonGroup>
                </div>
            </div>
        )
    }
}