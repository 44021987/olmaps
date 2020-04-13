import Map from 'ol/Map'
import View from 'ol/View'
import { LineString } from 'ol/geom'
import { getLength } from 'ol/sphere'
import { ScaleLine } from 'ol/control'
import { defaults as defaultInteractions } from 'ol/interaction'

import * as utils from './utils'
import * as common from './common'
import { featureDrag } from './event/drag'
import { calculateGroup } from './component'
import { mapSrc, pixelNum } from './config'

const _event = {}
// 默认设置
const defaultsConfig = {
  target: 'map',
  center: [116.39786526, 39.92421163],
  zoom: 16,
  minZoom: 3,
  maxZoom: 20,
  scaleLine: true,
  mapSrc
}
export default class Ol {
  constructor(opts = {}) {
    // 图层集合，根据唯一标识id存放
    this.mapLayers = {}
    this.map = null
    this.layer = null
    this.init(opts)
  }
  /**
   * 初始化地图
   * @param {object} data
   */
  init (opts = {}) {
    for (const key in defaultsConfig) {
      if (opts[key] === undefined) opts[key] = defaultsConfig[key]
    }
    this.map = new Map({
      interactions: defaultInteractions({
        pinchRotate: opts.pinchRotate || false,
        doubleClickZoom: opts.doubleClickZoom || false
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
    // 添加拖拽
    const { Drag } = featureDrag(_event)
    this.map.addInteraction(new Drag())
    // 添加比例尺
    if (opts.scaleLine === true) this.map.addControl(new ScaleLine({ units: 'metric' }))
    return this
  }
  /**
   * 添加瓦片图层
   * @param {Array} layerUrls
   */
  addMapLayer (layerUrls) {
    if (!layerUrls instanceof Array) {
      throw Error('param:layerUrls not Array')
    }
    const layers = []
    layerUrls.forEach(item => {
      const layer = common.xyzLayer(item.name, item.src, item.visible)
      this.mapLayers[item.id] = layer
      layers.push(layer)
    })
    return layers
  }
  /**
   * 添加圆
   * @param {*} opts 
   * @param {*} callback 
   */
  addCircle (opts, callback) {
    opts.radius = common._transformCircleRadius(this.map, opts.radius)
    const { features, data } = utils.circle(opts)
    common.addLayer(features, this)
    callback && callback(data, features)
    return data
  }
  /**
   * 绘制多边形
   * @param {*} coordinates 
   * @param {*} callback 
   */
  addPolygon (coordinates, callback) {
    let polygon = null
    // 如果传入数组，采用默认样式，为了兼容老版本
    if (coordinates instanceof Array) {
      polygon = utils.polygon(coordinates)
    } else {
      // 自定义style
      polygon = utils.adPolygon(coordinates || {})
    }
    const { features, data } = polygon
    common.addLayer(features, this)
    callback && callback(data, features)
    return data
  }
  /**
   * 描边
   * @param {*} opts 
   * @param {*} callback 
   */
  addMultiPolygon (opts, callback) {
    const polygonLayer = utils.multiPolygon(opts)
    const { features, data } = polygonLayer
    common.addLayer(features, this)
    callback && callback(data, polygonLayer)
    return data
  }
  /**
   * 绘制点标记
   * @param {Array} pointArray 点配置集合
   * @param {Function} callback 
   */
  addMarker (pointArray, callback) {
    const markersLayer = utils.marker(pointArray)
    const { features, data } = markersLayer
    common.addLayer(features, this)
    callback && callback(data, markersLayer)
    return data
  }
  /**
   * 绘制线
   * @param {Array} lineOptsArr 线配置集合
   * @param {Function} callback
   */
  addLine (lineOptsArr, callback) {
    const lineLayer = utils.lineString(lineOptsArr)
    const features = lineLayer.features
    common.addLayer(features, this)
    callback && callback(lineLayer.data)
    return lineLayer.data
  }
  // 获取地图中心点
  getCenter (callback) {
    const center = this.map.getView().getCenter()
    callback && callback(common.transProj(center))
    return center
  }
  getRequestUrl (callback) {
    callback && callback(mapSrc)
    return mapSrc
  }
  getZoom (callback) {
    const zoom = this.map.getView().getZoom()
    callback && callback({
      zoom
    })
    return Math.round(zoom * 10) / 10
  }
  zoomIn () {
    let zoom = this.getZoom()
    this.map.getView().animate({
      zoom: zoom + 1,
      duration: 300
    })
  }
  zoomOut () {
    let zoom = this.getZoom()
    this.map.getView().animate({
      zoom: zoom - 1,
      duration: 300
    })
  }
  zoomTo (zoom) {
    this.map.getView().animate({
      zoom: parseInt(zoom),
      duration: 0
    })
  }
  setMapType (type) {
    const that = this
    function setVisible (keyArr) {
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
  // 设置地图中心点
  setMapCenter (center) {
    if (!center instanceof Array) throw Error('参数格式错误，应该为Array')
    const lat = center[1] | 0
    const lon = center[0] | 0
    // 经纬度简单验证
    if (lon > 180 || lat > 90) throw Error(`经纬度范围错误:${center}`)
    this.map.getView().animate({
      center: common.transformLonLat(center),
      duration: 300
    })
  }
  // 根据集合删除feature
  removeFeature (ids) {
    const result = common.getAllFeatures(this.map)
    const features = result.features
    const featureLayer = result.featureLayer
    let len = 0
    for (let i = 0; i < features.length; i++) {
      const feature = features[i]
      const id = feature.get('id')
      if (ids.indexOf(id) >= 0) {
        featureLayer.removeFeature(feature)
        len += 1
        if (len === ids.length) break
      }

    }
  }
  calculateGroup (opts = {}, callback) {
    const ids = calculateGroup(opts, this)
    callback && callback(ids)
  }
  clear () {
    this.map.removeLayer(this.layer)
    this.layer = null
    try {
      this.map.getOverlays().forEach(o => o.setPosition(undefined))
    } catch (error) {
      console.log(error)
    }
  }
  onCameraChange (callback) {
    const that = this
    this.map.on('moveend', function (evt) {
      const center = evt.map.getView().getCenter()
      const data = {
        center: common.transProj(center),
        zoom: that.getZoom()
      }
      callback && callback(data)
    })
  }
  pointermove (callback) {
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
  on (type, callback) {
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
  getDistanceFromPixel (num = pixelNum) {
    const point1 = this.map.getView().getCenter()
    const pixel1 = this.map.getPixelFromCoordinate(point1)
    if (!pixel1) return 0
    const pixel2 = [pixel1[0] + num, pixel1[1]]
    const point2 = this.map.getCoordinateFromPixel(pixel2)
    const dis = getLength(new LineString([point1, point2]))
    return parseInt(Math.round(dis * 100) / 100)
  }
  getCoordinateLength (coordinate) {
    const dis = getLength(new LineString(common.transformLonLat(coordinate)))
    return parseInt(Math.round(dis * 100) / 100)
  }
}
// 挂载公共方法
Object.assign(Ol.prototype, utils)
Object.assign(Ol.prototype, common)
