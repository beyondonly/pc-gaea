import * as React from 'react'
import * as typings from './header.type'
import {observer, inject} from 'mobx-react'

import {autoBindMethod} from '../../../../../../common/auto-bind/src'
import notice from '../../../../../message/src'
import Setting from './setting/setting.component'
import Online from './online/online.component'

import * as keymaster from 'keymaster'
import * as classNames from 'classnames'

import './header.scss'

@inject('application', 'viewport')
@observer
export default class Header extends React.Component <typings.PropsDefine, typings.StateDefine> {
    static defaultProps: typings.PropsDefine = new typings.Props()
    public state: typings.StateDefine = new typings.State()

    componentWillMount() {
        // 添加快捷键
        keymaster('ctrl+z', this.undo)
        keymaster('command+z', this.undo)

        keymaster('ctrl+shift+z', this.redo)
        keymaster('command+shift+z', this.redo)

        keymaster('ctrl+s', this.handleSave)
        keymaster('command+s', this.handleSave)

        keymaster('ctrl+c', this.copy)
        keymaster('command+c', this.copy)

        keymaster('ctrl+v', this.paste)
        keymaster('command+v', this.paste)
    }

    componentWillUnmount() {
        // 移除快捷键
        keymaster.unbind('ctrl+z')
        keymaster.unbind('command+z')

        keymaster.unbind('ctrl+shift+z')
        keymaster.unbind('command+shift+z')

        keymaster.unbind('ctrl+s')
        keymaster.unbind('command+s')

        keymaster.unbind('ctrl+c')
        keymaster.unbind('command+c')

        keymaster.unbind('ctrl+v')
        keymaster.unbind('command+v')
    }

    /**
     * 点击保存按钮
     */
    @autoBindMethod handleSave() {
        // 获取增量编辑信息
        const componentsInfo = this.props.viewport.getIncrementComponentsInfo()
        this.props.application.event.emit(this.props.application.event.onSave, componentsInfo)
        return false
    }

    /**
     * 点击预览按钮
     */
    @autoBindMethod handlePreview() {
        this.props.application.setPreview(!this.props.application.isPreview)
        if (this.props.application.isPreview) {
            // 隐藏附加侧边栏
            this.props.viewport.hideSidebarAddon()
        }
    }

    /**
     * 回撤
     */
    @autoBindMethod undo() {
        this.props.viewport.undo()
        return false
    }

    /**
     * 重做
     */
    @autoBindMethod redo() {
        this.props.viewport.redo()
        return false
    }

    /**
     * 复制
     */
    @autoBindMethod copy() {
        this.props.viewport.copy(this.props.viewport.hoveringComponentMapUniqueKey)
        return false
    }

    /**
     * 粘贴
     */
    @autoBindMethod paste() {
        if (!this.props.viewport.paste(this.props.viewport.hoveringComponentMapUniqueKey)) {
            notice.warning('此处无法粘贴')
        }
        return false
    }

    /**
     * 修改视图大小
     */
    @autoBindMethod handleChangeViewportWidth(width: number) {
        this.props.application.setViewportWidth(width)
    }

    @autoBindMethod handleChangeViewportWidthByRange(event: any) {
        this.props.application.setViewportWidth(Number(event.target.value))
    }

    render() {
        const undoClasses = classNames({
            'menu-item': true,
            'operate-disable': !this.props.viewport.canUndo
        })

        const redoClasses = classNames({
            'menu-item': true,
            'operate-disable': !this.props.viewport.canRedo
        })

        const mobileClasses = classNames({
            'menu-item': true,
            'viewport-size-active': this.props.application.viewportWidth === 40
        })

        const desktopClasses = classNames({
            'menu-item': true,
            'viewport-size-active': this.props.application.viewportWidth === 100
        })

        return (
            <div className="_namespace"
                 height={this.props.application.headerHeight - 1}>
                <div className="left">
                    <div className="brand menu-item">{this.props.application.title}</div>
                    <Setting/>
                </div>

                <div className="right">
                    <div className="size-group">
                        <div className={mobileClasses}
                             onClick={this.handleChangeViewportWidth.bind(this,40)}><i className="fa fa-mobile"/></div>
                        <div className={desktopClasses}
                             onClick={this.handleChangeViewportWidth.bind(this,100)}><i className="fa fa-desktop"/>
                        </div>

                        <div className="slider-container">
                            <input onChange={this.handleChangeViewportWidthByRange}
                                   min="10"
                                   max="100"
                                   step="1"
                                   value={this.props.application.viewportWidth}
                                   className="slider"
                                   type="range"/>
                        </div>
                    </div>

                    <div className={undoClasses}
                         onClick={this.undo}><i className="fa fa-undo"/></div>
                    <div className={redoClasses}
                         onClick={this.redo}><i className="fa fa-rotate-right"/></div>
                    <div className="menu-item"
                         onClick={this.handlePreview}>{this.props.application.isPreview ? '取消' : '预览'}</div>
                    <div className="menu-item"
                         onClick={this.handleSave}>保存
                    </div>
                </div>
            </div>
        )
    }
}

// <Online key="online"/>