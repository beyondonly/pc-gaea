import * as React from 'react'
import * as typings from './set-group-button.type'
import {observer, inject} from 'mobx-react'

import Modal from '../../../../../../../modal/src'
import Button from '../../../../../../../button/src'
import Input from '../../../../../../../input/src'

import './set-group-button.scss'

@inject('viewport', 'application') @observer
export default class SetGroupButton extends React.Component <typings.PropsDefine, typings.StateDefine> {
    static defaultProps: typings.PropsDefine = new typings.Props()
    public state: typings.StateDefine = new typings.State()

    handleShowModal() {
        this.setState({
            show: true
        })
    }

    handleOk() {
        const fullInfo = this.props.viewport.getComponentFullInfoByMapUniqueKey(this.props.viewport.currentEditComponentMapUniqueKey)
        this.props.application.addComboComponent({
            name: this.state.name,
            mapUniqueKey: fullInfo.mapUniqueKey,
            componentInfo: fullInfo.componentInfo,
            childs: fullInfo.childs
        })
        this.setState({
            show: false,
            name: ''
        })
    }

    handleCancel() {
        this.setState({
            show: false,
            name: ''
        })
    }

    handleChangeName(event: any) {
        this.setState({
            name: event.target.value
        })
    }

    render() {
        return (
            <Button onClick={this.handleShowModal.bind(this)}>
                设为组合
                <Modal className="_namespace"
                       show={this.state.show}
                       onOk={this.handleOk.bind(this)}
                       onCancel={this.handleCancel.bind(this)}>
                    <Input onChange={this.handleChangeName.bind(this)}
                           label="输入组名"/>
                    <p className="description">设为组合的元素,会在右侧『组件』栏中『组合』选项中出现.</p>
                </Modal>
            </Button>
        )
    }
}