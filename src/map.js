import Map from 'ol/Map'
import View from 'ol/View'
import { LineString } from 'ol/geom'
import { getLength } from 'ol/sphere'
import { ScaleLine } from 'ol/control'
import { defaults as defaultInteractions } from 'ol/interaction'

import * as utils from './utils'
import * as common from './common'
import { featureDrag } from './event/drag'
// import { calculateGroup } from './component'
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
    this.map = null
    this.layer = null
    // 图层集合，根据唯一标识id存放
    this.mapLayers = {}
    // 基础配置
    this.config = Object.assign(defaultsConfig, opts)
    this.zoomDisMap = Object.freeze({
      '2': 5000000,
      '3': 2000000,
      '4': 1000000,
      '5': 500000,
      '6': 200000,
      '7': 100000,
      '8': 50000,
      '9': 20000,
      '10': 10000,
      '11': 7500,
      '12': 5000,
      '13': 2000,
      '14': 1000,
      '15': 500,
      '16': 200,
      '17': 100,
      '18': 50
    })
    this.init(opts)
  }
  /**
   * 初始化地图
   * @param {object} data
   */
  init () {
    const opts = this.config
    this.map = new Map({
      interactions: defaultInteractions({
        pinchRotate: opts.pinchRotate || false,
        doubleClickZoom: opts.doubleClickZoom || false
      }),
      target: opts.target,
      layers: this.addMapLayer(opts.mapSrc),
      view: new View({
        center: this.transformLonLat(opts.center),
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
      const layer = this.xyzLayer(item.name, item.src, item.visible)
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
    opts.radius = this._transformCircleRadius(this.map, opts.radius)
    const { features, data } = utils.circle(opts)
    this.addLayer(features, this)
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
    this.addLayer(features, this)
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
    this.addLayer(features, this)
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
    this.addLayer(features, this)
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
    this.addLayer(features, this)
    callback && callback(lineLayer.data)
    return lineLayer.data
  }
  // 获取地图中心点
  getCenter (callback) {
    const center = this.map.getView().getCenter()
    callback && callback(this.transProj(center))
    return center
  }
  getRequestUrl (callback) {
    callback && callback(mapSrc)
    return mapSrc
  }
  // 获取当前层级
  getZoom (callback) {
    const zoom = this.map.getView().getZoom()
    callback && callback({
      zoom
    })
    return Math.round(zoom * 10) / 10
  }
  // 放大层级
  zoomIn () {
    let zoom = this.getZoom()
    this.map.getView().animate({
      zoom: zoom + 1,
      duration: 300
    })
  }
  // 缩小层级
  zoomOut () {
    let zoom = this.getZoom()
    this.map.getView().animate({
      zoom: zoom - 1,
      duration: 300
    })
  }
  // 设置层级
  zoomTo (zoom) {
    this.map.getView().animate({
      zoom: parseInt(zoom),
      duration: 0
    })
  }
  // 根据id设置显示的图层
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
      center: this.transformLonLat(center),
      duration: 300
    })
  }
  // 根据集合删除feature
  removeFeature (ids) {
    const { features, featureLayer } = this.getAllFeatures(this.map)
    let matchNum = 0
    for (const f of features) {
      const id = f.get('id')
      if (ids.indexOf(id) !== -1) {
        featureLayer.removeFeature(f)
        // 当符合的feature和传入的id长度一致时停止循环
        if (matchNum === ids.length - 1) return
        matchNum++
      }
    }
  }
  // calculateGroup (opts = {}, callback) {
  //   const ids = calculateGroup(opts, this)
  //   callback && callback(ids)
  // }
  // 清除覆盖物及气泡
  clear () {
    this.map.removeLayer(this.layer)
    this.layer = null
    try {
      // 设置弹出层不可见，实际不清除
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
        center: this.transProj(center),
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
  /**
   * 自定义事件回调
   * @param {String} type 事件类型
   * @param {Function} callback 
   */
  on (type, callback) {
    if (typeof callback !== 'function') return
    // 事件名称映射
    const evtMap = {
      markerClick: 'onMarkerClick',
      markerLongClick: 'onMarkerLongClick',
      markerDrag: 'onMarkerDragEnd'
    }
    // 点位事件
    if (evtMap[type]) {
      _event[evtMap[type]] = callback
      return
    }
    // change事件派发
    this.onCameraChange(callback)
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
  /**
   * 获取2个经纬度距离
   * @param {array} coordinate 
   */
  getCoordinateLength (coordinate) {
    const dis = getLength(new LineString(this.transformLonLat(coordinate)))
    return parseInt(Math.round(dis * 100) / 100)
  }
}
// 挂载公共方法
Object.assign(Ol.prototype, utils)
Object.assign(Ol.prototype, common)
