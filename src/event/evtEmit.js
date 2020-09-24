/**
 * 发布-订阅
 */
export default class EventEmit {
  constructor() {
    this._evtCbs = {}
  }
  /**
   * @description 订阅的消息添加进缓存列表
   * @param {String} key 订阅名称
   * @param {Function} fn 回调函数
   */
  _listen (key, fn) {
    if (!this._evtCbs[key]) {
      this._evtCbs[key] = []
    }
    this._evtCbs[key].push(fn)
  }
  /**
   * @description 发布消息，执行缓存列表
   * @param {String} key 订阅名称
   * @param {String} args 参数
   */
  _trigger (key, ...args) {
    const cbs = this._evtCbs[key]
    if (!cbs || cbs.length === 0) {
      return false
    }
    cbs.forEach(cb => cb.apply(this, args))
  }
  /**
   * @description 解绑观察
   * @param {String} key 订阅名称
   * @param {Function} fn 绑定的函数
   */
  _remove (key, fn) {
    const cbs = this._evtCbs[key]
    // 没有回调集合不执行
    if (!cbs) {
      return false
    }
    if (!fn) { // 没有传递函数时，解绑所有函数
      cbs && (cbs.length = 0)
    } else {
      cbs.forEach((cb, i) => { // 解绑指定函数
        if (cb === fn) cbs.splice(i, 1)
      })
    }
  }
}