import * as React from 'react'
import * as typings from './page.type'
import {observer, inject} from 'mobx-react'

import * as classNames from 'classnames'
import * as _ from 'lodash'

import SidebarTools from './sidebar-tools/sidebar-tools.component'
import SidebarToolsPreview from './sidebar-tools-preview/sidebar-tools-preview.component'
import Footer from './footer/footer.component'
import Viewport from './viewport/viewport.component'
import ViewportSidebarResize from './viewport-sidebar-resize/viewport-sidebar-resize.component'
import HeaderNav from './header/header.component'
import EditBox from '../panel/edit-box/edit-box.component'
import OuterMoveBox from './outer-move-box/outer-move-box.component'

import Preview from '../../../../gaea-preview/src'

import './page.scss'

@inject('viewport', 'application') @observer
export default class Page extends React.Component <typings.PropsDefine, typings.StateDefine> {
    static defaultProps: typings.PropsDefine = new typings.Props()
    public state: typings.StateDefine = new typings.State()

    componentWillMount() {
        if (_.isEmpty(this.props.application.defaultValue)) {
            // 如果没有 defaultValue, 生成根节点
            this.props.viewport.createRootUniqueId()
            const LayoutClass = this.props.application.getComponentByUniqueKey('gaea-layout')
            // 布置最外层的画布
            let layoutProps = _.cloneDeep(LayoutClass.defaultProps)
            layoutProps['minHeight'] = 500
            this.props.viewport.components.set(this.props.viewport.rootMapUniqueKey, {
                props: layoutProps,
                layoutChilds: [],
                parentMapUniqueKey: null
            })
        } else {
            // 有的话, 直接用 defaultValue
            Object.keys(this.props.application.defaultValue).forEach(mapUniqueKey=> {
                const defaultInfo = this.props.application.defaultValue[mapUniqueKey]
                const ComponentClass = this.props.application.getComponentByUniqueKey(defaultInfo.props.gaeaUniqueKey)

                // 如果是根节点, 设置根据点 id
                if (defaultInfo.parentMapUniqueKey === null) {
                    this.props.viewport.setRootUniqueId(mapUniqueKey)
                }

                let props = _.cloneDeep(ComponentClass.defaultProps)
                defaultInfo.props && Object.keys(defaultInfo.props).forEach(propsKey=> {
                    props[propsKey] = defaultInfo.props[propsKey]
                })

                this.props.viewport.components.set(mapUniqueKey, {
                    props,
                    layoutChilds: defaultInfo.layoutChilds || [],
                    parentMapUniqueKey: defaultInfo.parentMapUniqueKey
                })
            })
        }

    }

    render() {
        const sectionClasses = classNames({
            'section': true,
            'section-transition': !this.props.application.isSidebarMoving,
            'preview': this.props.application.isPreview
        })

        return (
            <div className="_namespace"
                 style={{height:this.props.application.height}}>

                <div style={{width:this.props.application.sidebarWidth}}
                     className="sidebar">
                    <SidebarTools />
                    <SidebarToolsPreview />
                    <ViewportSidebarResize />
                </div>

                <div className={sectionClasses}>
                    <HeaderNav />

                    <div className="section-container"
                         style={{height:`calc(100% - ${this.props.application.headerHeight + this.props.application.footerHeight}px)`}}>
                        <Viewport/>
                        <EditBox/>
                        <OuterMoveBox />
                        {this.props.application.isPreview &&
                        <div className="preview-container">
                            <Preview value={this.props.viewport.getIncrementComponentsInfo()}
                                     baseComponents={this.props.application.baseComponents}
                                     customComponents={this.props.application.customComponents}/>
                        </div>
                        }
                    </div>

                    <Footer />
                </div>

            </div>
        )
    }
}
//
// <Header height={this.props.application.headerHeight}>
//     <HeaderNav />
// </Header>