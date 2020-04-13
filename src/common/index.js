import { Vector } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import * as featureStyle from '../utils/featureStyle'

import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { fromLonLat, getPointResolution, transform } from 'ol/proj'
import { METERS_PER_UNIT } from 'ol/proj/Units'

import { devicePixelRatio as tilePixelRatio } from '../config'

// 验证数组类型
const isArray = arr => arr instanceof Array

// 层级对应的大致比例尺
const olmapScale = {
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
}

/**
 * map addLayer
 * @param {Array} features实例
 * @param {context} context 
 */
export const addLayer = function (features, context) {
  context = context || this
  if (!context.layer) {
    const layer = new Vector({
      source: new VectorSource({
        features
      }),
      style: function (feature) {
        return featureStyle.getStyle(featureStyle, feature, context)
      }
    })
    context.map.addLayer(layer)
    context.layer = layer
  } else {
    context.layer.getSource().addFeatures(features)
  }
}
/**
 * 废弃：改用xyzLayer
 * get XYZ Layer
 * @param {String} title 
 * @param {String} url 
 * @param {Boolean} visible 
 */
export const getLayer = (title, url, visible) => {
  return new TileLayer({
    title: title,
    visible: visible || false,
    source: new XYZ({
      url: url,
      tilePixelRatio
    })
  })
}
/**
 * get XYZ Layer
 * @param {String} title 
 * @param {String} url 
 * @param {Boolean} visible 
 */
export const xyzLayer = (title, url, visible) => {
  return new TileLayer({
    title: title,
    visible: visible || false,
    source: new XYZ({
      url: url,
      tilePixelRatio
    })
  })
}

/**
 * 获取所有的feature覆盖物
 * @param {*} map map实例，没传默认取调用函数的map
 */
export const getAllFeatures = function (map) {
  const data = {}
  map = map || this.map
  // 如果没有map实例停止执行下面代码
  if (!map) {
    console.info('没有取到map实例')
    return data
  }
  const layers = map.getLayers().getArray()

  for (let i = 0; i < layers.length; i++) {
    const source = layers[i]
    const getFeatures = source.getSource().getFeatures
    if (typeof getFeatures === 'function') {
      data.features = source.getSource().getFeatures()
      data.featureLayer = source.getSource()
      break
    }
  }
  return data
}
/**
 * transfrom lonLat proj from 4326 to 3857
 * @param {Array} lonLatArr
 */
export const transformLonLat = lonLatArr => {
  if (!isArray(lonLatArr)) throw Error(`Method:transformLonLat 参数格式错误 ${lonLatArr}`)
  function getlonLat (lonLatArr) {
    if (!isArray(lonLatArr[0]) && lonLatArr.length === 2) {
      return fromLonLat([Number(lonLatArr[0]), Number(lonLatArr[1])])
    }
    const result = []
    lonLatArr.forEach(item => {
      if (isArray(item) && !isArray(item[0])) {
        result.push(fromLonLat([Number(item[0]), Number(item[1])]))
      } else {
        result.push(getlonLat(item))
      }
    })
    return result
  }
  return getlonLat(lonLatArr)
}

/**
 * get precise radius of different resolution
 * @param {map} map 
 * @param {Number} r 
 */
export const _transformCircleRadius = (map, r) => {
  const view = map.getView()
  const projection = view.getProjection()
  const resolutionAtEquator = view.getResolution()
  const center = view.getCenter()
  const pointResolution = getPointResolution(projection, resolutionAtEquator, center)
  const resolutionFactor = resolutionAtEquator / pointResolution;
  return Math.round((r / METERS_PER_UNIT.m) * resolutionFactor * 100) / 100
}

/**
 * 转换坐标
 * @param {*} lonLatArr 
 * @param {*} oldproj 
 * @param {*} newproj 
 */
export const transProj = (lonLatArr, oldproj = 'EPSG:3857', newproj = 'EPSG:4326') => {
  // 校验类型
  if (!isArray(lonLatArr)) throw Error(`参数格式错误:${lonLatArr}`)
  // 校验长度
  if (lonLatArr.length < 2) throw Error(`参数格式错误:${lonLatArr}`)
  function trans (lonLatArr, oldproj, newproj) {
    // 不是多组转换的情况
    if (!isArray(lonLatArr[0]) && lonLatArr.length === 2) {
      return transform([Number(lonLatArr[0]), Number(lonLatArr[1])], oldproj, newproj)
    }
    // 转换多组经纬度
    const result = []
    lonLatArr.forEach(item => {
      if (isArray(item) && !isArray(item[0])) {
        result.push(transform([Number(item[0]), Number(item[1])], oldproj, newproj))
      } else {
        result.push(trans(item))
      }
    })
    return result
  }
  return trans(lonLatArr, oldproj, newproj)
}

/**
 * 根据距离获取接近的层级
 * @param {Number} dis 距离
 */
export const getZoomWidthDis = dis => {
  const zoomKey = Object.keys(olmapScale)
  for (let i = 0; i < zoomKey.length; i++) {
    const key = zoomKey[i]
    if ((dis | 0) >= olmapScale[key]) {
      return key | 0
    }
  }
}

/**
 * 获取地图对角线经纬度
 * @param {*} olmaps 实例
 */
export const mapExtent = function (olmaps) {
  olmaps = olmaps || this
  const size = olmaps.map.getSize()
  const ext = olmaps.map.getView().calculateExtent(size)
  const leftBottom = olmaps.transProj([ext[0], ext[1]])
  const rightTop = olmaps.transProj([ext[2], ext[3]])
  return {
    leftBottom,
    rightTop,
    leftTop: [leftBottom[0], rightTop[1]],
    rightBootom: [rightTop[0], leftBottom[1]]
  }
}
