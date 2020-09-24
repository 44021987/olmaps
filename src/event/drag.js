import LineString from 'ol/geom/LineString'
import { inherits } from 'ol/util'
// import { defaults as defaultInteractions, Pointer as PointerInteraction } from 'ol/interaction'
import { Pointer as PointerInteraction } from 'ol/interaction'
import { transProj, getAllFeatures } from '../common'
import { endDI, lineDI } from '../config'

/**
 * 是否需要点击时间回调，id不为endDI的触发回调
 * @param {*} feature 
 */
function isNeedclickCallback (feature) {
  const id = feature.get('id')
  return !new RegExp(endDI).test(id)
}

// 计算拖拽距离
function cakculateDI (feature, coordinate, map) {
  if (isNeedclickCallback(feature)) return
  const id = feature.get('id')
  const lineid = id.split(endDI).shift() + lineDI
  const features = getAllFeatures(map).features

  for (let i = 0; i < features.length; i++) {
    const feature = features[i]
    if (feature.get('id') === lineid && feature.get('type') === 'lineString') {
      const geometry = feature.getGeometry()
      geometry.forEachSegment((start, end) => {
        const updateGeometry = new LineString([start, coordinate])
        feature.setGeometry(updateGeometry)
      })
      break
    }
  }
}
/**
 * 判断点击对象是否为icon类型
 * @param {*} feature 当前对象
 * @param {*} coordinates 经纬度 
 * @param {*} context
 */
function isIconType (feature, coordinates, context) {
  const olId = feature.get('id')
  const isDrag = feature.get('drag')
  const isIcon = feature.get('type') === 'icon'
  // 如果是icon类型并且不能被拖拽，则绑定长按事件
  if (isIcon && !isDrag) {
    context.longClickEvt = setTimeout(() => {
      const { markerLongClick = [] } = context._event
      if (markerLongClick.length) {
        markerLongClick.forEach(cb => cb({ coordinates: transProj(coordinates), olId }))
      }
      context.longClickEvt = null
    }, context.longClickTime)
  }
  return isIcon
}

/**
 * 绑定拖拽
 */
function bindMarkerClickDrag () {
  const type = this.feature_.get('type')
  const olId = this.feature_.get('id')
  if (this.longClickEvt) clearTimeout(this.longClickEvt)
  if (type !== 'icon') return
  // 对象经纬度
  const point = this.feature_.getGeometry().getCoordinates()
  // 判断经纬度是否改变
  const isModified = !(this.oldcoordinate_.toString() === point.toString())
  const iconData = {
    coordinates: transProj(point),
    olId
  }
  const { markerDrag = [], markerClick = [] } = this._event
  // 如果被改变了触发拖拽事件
  if (isModified) {
    const data = {
      ...iconData,
      oldCoordinates: transProj(this.oldcoordinate_)
    }
    markerDrag.length && markerDrag.forEach(cb => cb(data))
  } else {
    if (Date.now() - this.time < this.longClickTime) {
      if (isNeedclickCallback(this.feature_)) {
        markerClick.length && markerClick.forEach(cb => cb(iconData))
      }
    }
  }
}

export const featureDrag = _event => {
  const app = {}
  app.Drag = function () {
    PointerInteraction.call(this, {
      handleDownEvent: app.Drag.prototype.handleDownEvent,
      handleDragEvent: app.Drag.prototype.handleDragEvent,
      handleMoveEvent: app.Drag.prototype.handleMoveEvent,
      handleUpEvent: app.Drag.prototype.handleUpEvent
    })
    // 当前被操作的对象
    this.feature_ = null
    // 拖拽后的经纬度
    this.coordinate_ = null
    // 拖拽之前的经纬度
    this.oldcoordinate_ = null
    // 鼠标显示cursor Style
    this.cursor_ = 'pointer'

    this.previousCursor_ = undefined
    // 当前鼠标按下的时间戳
    this.time = 0
    // 拖拽的响应时长
    this.dragTime = 800
    // 长按响应时间
    this.longClickTime = 1500
    // 长按的回调函数
    this.longClickEvt = null
    // 绑定的事件
    this._event = _event
  }

  // inherits(app.Drag, PointerInteraction)

  if (PointerInteraction) app.Drag.__proto__ = PointerInteraction
  app.Drag.prototype = Object.create(PointerInteraction && PointerInteraction.prototype)
  app.Drag.prototype.constructor = app.Drag

  /**
   * 返回false阻止拖拽，true标识可拖拽
   * @param {evt} event
   * @return {boolean} `false` to stop the drag feature
   * get features, only if the features's type is icon can it be draged
   * long Click Event to callback Android, when the feature's property of drag is not true
   */
  app.Drag.prototype.handleDownEvent = function (evt) {
    const map = evt.map
    // 获取当前操作的对象
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      return feature
    })
    let isIcon = false
    // 记录时间戳
    this.time = Date.now()
    if (feature) {
      const coordinates = feature.getGeometry().getCoordinates()
      this.coordinate_ = evt.coordinate
      this.feature_ = feature
      this.oldcoordinate_ = coordinates
      isIcon = isIconType(feature, coordinates, this)
    }
    return isIcon
  }

  /**
   * 拖拽发生
   * only if the features's propety of drag is true can it be draged
   * clear long click event
   * drag event will be triggered when the handleDown time more than dragTime
   */
  app.Drag.prototype.handleDragEvent = function (evt) {
    if (this.longClickEvt) clearTimeout(this.longClickEvt)
    // 不是拖拽类型不触发
    if (!this.feature_.get('drag')) return
    // 没有达到拖拽时间不触发
    if (Date.now() - this.time < this.dragTime) return
    const deltaX = evt.coordinate[0] - this.coordinate_[0]
    const deltaY = evt.coordinate[1] - this.coordinate_[1]
    const geometry = this.feature_.getGeometry()
    this.coordinate_[0] = evt.coordinate[0]
    this.coordinate_[1] = evt.coordinate[1]
    // 移动
    geometry.translate(deltaX, deltaY)
    cakculateDI(this.feature_, evt.coordinate, evt.map)
  }

  /**
   * 添加鼠标状态
   */
  app.Drag.prototype.handleMoveEvent = function (evt) {
    if (this.cursor_) {
      const map = evt.map;
      const feature = map.forEachFeatureAtPixel(evt.pixel, feature => feature)
      const element = map.getTargetElement()
      if (feature) {
        if (element.style.cursor != this.cursor_) {
          this.previousCursor_ = element.style.cursor
          element.style.cursor = this.cursor_
        }
      } else if (this.previousCursor_ !== undefined) {
        element.style.cursor = this.previousCursor_
        this.previousCursor_ = undefined;
      }
    }
  }

  /**
   * @return {boolean} `false` to stop the drag sequence
   * if feature's coordinates has been modified, Android's methods named markerDrag will be triggered
   * if it was not modified, Android's methods named markerClick will be triggered
   * init data
   */
  app.Drag.prototype.handleUpEvent = function (evt) {
    bindMarkerClickDrag.call(this)
    this.coordinate_ = null
    this.feature_ = null
    this.time = 0
    return false
  }
  return app
}
