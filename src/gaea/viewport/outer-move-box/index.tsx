import * as React from 'react'
import connect from '../../utils/connect'
import * as module from './module'
import * as _ from 'lodash'
import './index.scss'

@connect(
    (state: any) => {
        return {
            outerMoveBox: state.outerMoveBox.toJS(),
            section: state.section.toJS()
        }
    },
    {}
)
export default class OuterMoveBox extends React.Component <module.PropsInterface, module.StateInterface> {
    static defaultProps: module.PropsInterface = new module.Props()
    public state: module.StateInterface = new module.State()

    shouldComponentUpdate(nextProps: any) {
        if (_.isEqual(this.props['outerMoveBox'], nextProps['outerMoveBox']) && _.isEqual(this.props['section'], nextProps['section'])) {
            return false
        }
        return true
    }

    render() {
        if (!this.props.outerMoveBox.show)return null

        // 初始化拿不到数据返回 null
        if (_.isEmpty(this.props.section))return null

        const style = {
            left: this.props.outerMoveBox.left - this.props.section.left,
            top: this.props.outerMoveBox.top - this.props.section.top - 2,
            width: this.props.outerMoveBox.width,
            height: this.props.outerMoveBox.height,
        }

        return (
            <div className="_namespace"
                 style={style}></div>
        )
    }
}