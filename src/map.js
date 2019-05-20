import Map from 'ol/Map'
import View from 'ol/View'
import { LineString } from 'ol/geom'
import { getLength } from 'ol/sphere'
import {ScaleLine} from 'ol/control'
import {defaults as defaultInteractions} from 'ol/interaction'

import * as utils from './utils'
import * as common from './common'
import {featureDrag} from './event/drag'
import {calculateGroup} from './component'
import { mapSrc, pixelNum } from './config'

const _event = {}
// 默认设置
const defaultsConfig = {
  target: 'map',
  center: [116.39786526, 39.92421163],
  zoom: 16,
  minZoom: 3,
  maxZoom: 20,
  mapSrc
}
export default class Ol {
  constructor(opts={}) {
    this.mapLayers = {}
    this.map = null
    this.layer = null
    this.init(opts)
  }
  /**
   * 初始化地图
   * @param {object} opts
   */
  init(opts={}) {
    for (const key in defaultsConfig) {
      if (opts[key] === undefined) opts[key] = defaultsConfig[key]
    }
    this.map = new Map({
      interactions: defaultInteractions({
        pinchRotate: false,
        doubleClickZoom: false
      }),
      target: opts.target,
      layers: this.addMapLayer(opts.mapSrc),
      view: new View({
        center: common.transformLonLat(opts.center),
        projection: 'EPSG:3857',
        rotation: 0,
        zoom: opts.zoom,
        minZoom: opts.minZoom,
        maxZoom: opts.maxZoom
      })
    })
    const Drag = featureDrag(_event).Drag
    this.map.addInteraction(new Drag())
    this.map.addControl(new ScaleLine({units: 'metric'}))
  }
  addMapLayer(mapSrc) {
    const layers = []
    mapSrc.forEach(item => {
      const layer = common.getLayer(item.name, item.src, item.visible)
      this.mapLayers[item.id] = layer
      layers.push(layer)
    })
    return layers
  }
  addCircle(opts, callback) {
    opts.radius = common.transformCircleRadius(this.map, opts.radius)
    const circleLayer = utils.circle(opts)
    common.addLayer(this, circleLayer.features)
    callback && callback(circleLayer.data)
    return circleLayer.data
  }
  addPolygon(coordinates, callback) {
    const polygonLayer = utils.polygon(coordinates)
    common.addLayer(this, polygonLayer.features)
    callback && callback(polygonLayer.data)
    return polygonLayer.data
  }
  addMultiPolygon(opts, callback) {
    const polygonLayer = utils.multiPolygon(opts)
    common.addLayer(this, polygonLayer.features)
    callback && callback(polygonLayer.data)
    return polygonLayer.data
  }
  addMarker(pointArray, callback) {
    const markersLayer = utils.marker(pointArray)
    const features = markersLayer.features
    common.addLayer(this, features)
    callback && callback(markersLayer.data)
    return markersLayer.data
  }
  addLine(pointOpts, callback) {
    const lineLayer = utils.lineString(pointOpts)
    const features = lineLayer.features
    common.addLayer(this, features)
    callback && callback(lineLayer.data)
    return lineLayer.data
  }
  getCenter(callback) {
    const center = this.map.getView().getCenter()
    callback && callback(common.transProj(center))
    return center
  }
  getRequestUrl(callback) {
    callback && callback(mapSrc)
    return mapSrc
  }
  getZoom(callback) {
    const zoom = this.map.getView().getZoom()
    callback && callback({
      zoom
    })
    return Math.round(zoom*10)/10
  }
  zoomIn() {
    let zoom = this.getZoom()
    this.map.getView().animate({
      zoom: zoom + 1,
      duration: 300
    })
  }
  zoomOut() {
    let zoom = this.getZoom()
    this.map.getView().animate({
      zoom: zoom - 1,
      duration: 300
    })
  }
  zoomTo(zoom) {
    this.map.getView().animate({
      zoom: parseInt(zoom),
      duration: 0
    })
  }
  setMapType(type) {
    const that = this
    function setVisible(keyArr) {
      for (const key in that.mapLayers) {
        if (keyArr.indexOf(key) >= 0) {
          that.mapLayers[key].setVisible(true)
        } else {
          that.mapLayers[key].setVisible(false)
        }
      }
    }
    // 为了兼容老版本的number类型
    if (Object.prototype.toString.call(type, null).slice(8, -1) !== 'Array') {
      type = typeof type === 'number' ? [String(type)] : [type]
    }
    setVisible(type)
  }
  setMapCenter(center=[]) {
    this.map.getView().animate({
      center: common.transformLonLat(center),
      duration: 300
    })
  }
  removeFeature(ids) {
    const result = common.getAllFeatures(this.map)
    const features = result.features
    const featureLayer = result.featureLayer
    let len = 0
    for (let i = 0; i < features.length; i++) {
      const feature = features[i]
      const id = feature.get('id')
      if (ids.indexOf(id) >=0) {
        featureLayer.removeFeature(feature)
        len += 1
        if (len === ids.length) break
      }

    }
  }
  calculateGroup(opts={}, callback) {
    const ids = calculateGroup(opts, this)
    callback && callback(ids)
  }
  clear() {
    this.map.removeLayer(this.layer);
    this.layer = null;
  }
  onCameraChange(callback) {
    const that =this
    this.map.on('moveend', function (evt) {
      const center = evt.map.getView().getCenter()
      const data = {
        center: common.transProj(center),
        zoom: that.getZoom()
      }
      callback && callback(data)
    })
  }
  pointermove(callback) {
    this.map.on('pointermove', function (evt) {
      if (evt.dragging) {
        return
      }
      const pixel = this.getEventPixel(evt.originalEvent)
      const feature = this.forEachFeatureAtPixel(pixel, function (feature) {
        return feature
      })
      callback && callback(evt, feature)
    })
  }
  on(type, callback) {
    if (typeof callback !== 'function') return
    if (type === 'markerClick') {
      _event.onMarkerClick = callback
    } else if (type === 'markerLongClick') {
      _event.onMarkerLongClick = callback
    } else if (type === 'markerDrag') {
      _event.onMarkerDragEnd = callback
    } else if (type === 'change') {
      this.onCameraChange(callback)
    }
  }
  getDistanceFromPixel(num=pixelNum) {
    const point1 = this.map.getView().getCenter()
    const pixel1 = this.map.getPixelFromCoordinate(point1)
    if (!pixel1) return 0
    const pixel2 = [pixel1[0] + num, pixel1[1]]
    const point2 = this.map.getCoordinateFromPixel(pixel2)
    const dis = getLength(new LineString([point1, point2]))
    return parseInt(Math.round(dis * 100) / 100)
  }
  getCoordinateLength(coordinate) {
    const dis = getLength(new LineString(common.transformLonLat(coordinate)))
    return parseInt(Math.round(dis * 100) / 100)
  }
}

Object.assign(Ol.prototype, utils)
Object.assign(Ol.prototype, common)
