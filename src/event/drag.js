import LineString from 'ol/geom/LineString'
import {inherits} from 'ol/util'
import {Pointer as PointerInteraction} from 'ol/interaction'
import {transProj, getAllFeatures} from '../common'
import {endDI, lineDI} from '../config'

function isNeedclickCallback(feature) {
  const id = feature.get('id')
  if (new RegExp(endDI).test(id)) return false
  return true
}
function cakculateDI(feature, coordinate, map) {
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
function markerLongClick(feature, coordinates, obj) {
  const olId = feature.get('id')
  const isDrag = feature.get('drag')
  const isIcon = feature.get('type') === 'icon'

  if (!isDrag && isIcon) {
    obj.longClickEvt = setTimeout(() => {
      obj._event.onMarkerLongClick && obj._event.onMarkerLongClick({
        coordinates: transProj(coordinates),
        olId
      })
      obj.longClickEvt = null
    }, obj.longClickTime)
  }
  return isIcon
}
function bindMarkerClickDrag(obj) {
  const type = obj.feature_.get('type')
  const olId = obj.feature_.get('id')
  if (obj.longClickEvt) clearTimeout(obj.longClickEvt)
  if (type !== 'icon') return
  const point = obj.feature_.getGeometry().getCoordinates()
  const isModified = !(obj.oldcoordinate_.toString() === point.toString())
  const iconData = {
    coordinates: transProj(point),
    olId
  }
  if (isModified) {
    const data = {
      ...iconData,
      oldCoordinates: transProj(obj.oldcoordinate_)
    }
    obj._event.onMarkerDragEnd && obj._event.onMarkerDragEnd(data)
  } else {
    if (Date.now()-obj.time < obj.longClickTime) {
      if (isNeedclickCallback(obj.feature_)) {
        obj._event.onMarkerClick && obj._event.onMarkerClick(iconData)
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
    this.coordinate_ = null
    this.oldcoordinate_ = null
    this.cursor_ = 'pointer'
    this.feature_ = null
    this.previousCursor_ = undefined
    this.time = 0
    this.dragTime = 800
    this.longClickTime = 1500
    this.longClickEvt = null
    this._event = _event
  }

  inherits(app.Drag, PointerInteraction)
  /**
   * @param {evt} event
   * @return {boolean} `false` to stop the drag feature
   * get features, only if the features's type is icon can it be draged
   * long Click Event to callback Android, when the feature's property of drag is not true
   */
  app.Drag.prototype.handleDownEvent = function (evt) {
    const map = evt.map
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      return feature
    })
    let isIcon = false
    this.time = Date.now()
    if (feature) {
      const coordinates = feature.getGeometry().getCoordinates()
      this.coordinate_ = evt.coordinate
      this.feature_ = feature
      this.oldcoordinate_ = coordinates
      isIcon = markerLongClick(feature, coordinates, this)
    }
    return isIcon
  }
  
   /**
   * only if the features's propety of drag is true can it be draged
   * clear long click event
   * drag event will be triggered when the handleDown time more than dragTime
   */
  app.Drag.prototype.handleDragEvent = function (evt) {
    if (this.longClickEvt) clearTimeout(this.longClickEvt)
    if (Date.now()-this.time < this.dragTime) return
    if (!this.feature_.get('drag')) return
    const deltaX = evt.coordinate[0] - this.coordinate_[0]
    const deltaY = evt.coordinate[1] - this.coordinate_[1]
    const geometry = this.feature_.getGeometry()
    this.coordinate_[0] = evt.coordinate[0]
    this.coordinate_[1] = evt.coordinate[1]
    geometry.translate(deltaX, deltaY)
    cakculateDI(this.feature_, evt.coordinate, evt.map)
  }
  
  app.Drag.prototype.handleMoveEvent = function (evt) {
    if (this.cursor_) {
      const map = evt.map;
      const feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature) {
          return feature
        })
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
   * if feature's coordinates has been modified, Android's methods named onMarkerDragEnd will be triggered
   * if it was not modified, Android's methods named onMarkerClick will be triggered
   * init data
   */
  app.Drag.prototype.handleUpEvent = function (evt) {
    bindMarkerClickDrag(this)
    this.coordinate_ = null
    this.feature_ = null
    this.time = 0
    return false
  }
  return app
}
