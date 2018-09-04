/**
 * 限制input:1)只能输入正整数和0，2）输入的最小值min，3）输入的最大值max，4）输入的最大长度
 *
 * 用法1：
 * <el-input v-model="test" v-intRange:test="{max: 99}"></el-input>
 * 可以输入0-99的整数
 *
 * 用法2：
 * <li v-for="(item, i) in test">
 *  <el-input v-model="item.a" v-intRange="{field:`test.${i}.a`, min: 10, max: 999}"></el-input>
 * </li>
 * 可以输入10-999的整数
 *
 * 指令参数：
 * @param {String} field 需要改变的组件data中的字段（具体访问路径）
 * @param {Number} min 可输入的最小值，可缺省
 * @param {Number} max 可输入的最大值，可缺省
 * @param {Number} maxlength 可输入的最大字符长度，可缺省
 */

let IntRangePlugin = {}

IntRangePlugin.install = (Vue, options) => {
    Vue.directive('intRange', {
        componentUpdated: (el, binding, vnode) => {
            let arg = binding.arg
            let paramsObj = binding.value
            let { field, min, max, maxlength } = arg ? { field: arg, min: paramsObj.min, max: paramsObj.max, maxlength: paramsObj.maxlength } : binding.value

            if (min !== undefined) {
              min = parseInt(min)
            }
            if (max !== undefined) {
              max = parseInt(max)
            }
            if (maxlength !== undefined) {
              maxlength = parseInt(maxlength)
            }
            if (!field || (min!==undefined && isNaN(min)) || (max!==undefined && isNaN(max)) || min > max || (maxlength!==undefined && isNaN(maxlength))) {
                throw new Error('指令参数错误！')
            }

            let inputTarget = el
            if (el.tagName !== 'INPUT') {
                for (let element of el.childNodes) {
                    if (element.tagName === 'INPUT') {
                        inputTarget = element
                        break
                    }
                }
            }
            if (inputTarget.tagName !== 'INPUT') {
                throw new Error('指令绑定位置错误！')
            }

            let val = inputTarget.value
            let newVal = val.replace(/[^\d]/g, '')
            if (min !== undefined && newVal < min) {
                newVal = min
            }
            if (max !== undefined && newVal > max) {
                newVal = newVal.substring(0, newVal.length - 1)
            }
            if (maxlength !== undefined && newVal.length > maxlength) {
              newVal = newVal.substring(0, maxlength)
            }

            // 修改目标字段
            let theField = vnode.context
            let fields = field.split('.')
            let fieldsLength = fields.length
            let lastField = fields[fieldsLength - 1]
            for (let i = 0; i < fieldsLength - 1; i++) {
                theField = theField[fields[i]]
            }
            theField[lastField] = newVal
            // 修改input DOM上的value
            setTimeout(() => {
                inputTarget.value = newVal
            }, 0)
        }
    })
}

export default IntRangePlugin
