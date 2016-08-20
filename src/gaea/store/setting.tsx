/**
 * 设置
 */

import {observable, computed, map, transaction} from 'mobx'

export default class Setting {
    /**
     * 点击编辑框移除按钮时, 是否二次确认
     */
    @observable confirmWhenRemoveComponent: boolean = true
}