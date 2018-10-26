import {Vector} from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import * as featureStyle from '../utils/featureStyle'

import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import {fromLonLat, getPointResolution, transform} from 'ol/proj'
import {METERS_PER_UNIT} from 'ol/proj/Units'

import {devicePixelRatio as tilePixelRatio} from '../config'
/**
 * map addLayer
 * @param {context} context 
 * @param {Array} features
 */
export const addLayer = (context, features) => {
  if (!context.layer) {
    const layer = new Vector({
      source: new VectorSource({
        features
      }),
      style: function (feature) {
        // const key = `style_${feature.get('type')}`
        // if (featureStyle[key]) return featureStyle[key](feature, context)
        // return featureStyle.normalFill(feature, context)
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

export const getAllFeatures = map => {
  const layers = map.getLayers().getArray()
  const data = {}
  for (let i = 0; i < layers.length; i++) {
    const source = layers[i]
    if (source.type === 'VECTOR') {
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
  if (!Array.isArray(lonLatArr)) throw Error('参数格式错误')
  function getlonLat(lonLatArr) {
    if (!Array.isArray(lonLatArr[0]) && lonLatArr.length === 2) {
      return fromLonLat([Number(lonLatArr[0]), Number(lonLatArr[1])]) 
    }
    const result = []
    lonLatArr.forEach(item => {
      if (Array.isArray(item) && !Array.isArray(item[0])) {
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
export const transformCircleRadius = (map, r) => {
  const view = map.getView()
  const projection = view.getProjection()
  const resolutionAtEquator = view.getResolution()
  const center = view.getCenter()
  const pointResolution = getPointResolution(projection, resolutionAtEquator, center)
  const resolutionFactor = resolutionAtEquator/pointResolution;
  return Math.round((r / METERS_PER_UNIT.m) * resolutionFactor*100)/100
}

export const transProj = (lonLatArr, oldproj='EPSG:3857', newproj='EPSG:4326') => {
  if (!Array.isArray(lonLatArr)) throw Error('参数格式错误')
  function trans(lonLatArr, oldproj, newproj) {
    if (!Array.isArray(lonLatArr[0]) && lonLatArr.length === 2) {
      return transform([Number(lonLatArr[0]), Number(lonLatArr[1])], oldproj, newproj) 
    }
    const result = []
    lonLatArr.forEach(item => {
      if (Array.isArray(item) && !Array.isArray(item[0])) {
        result.push(transform([Number(item[0]), Number(item[1])]), oldproj, newproj)
      } else {
        result.push(trans(item))
      }
    })
    return result
  }
  return trans(lonLatArr, oldproj, newproj)
}

