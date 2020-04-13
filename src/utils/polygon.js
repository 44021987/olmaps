import Feature from 'ol/Feature'
import { Polygon } from 'ol/geom.js'
import uuidv4 from 'uuid/v4'
import { transformLonLat } from '../common'

/**
 * 绘制多边形,默认配置
 * @param {*} coordinates 
 */
export const polygon = (coordinates) => {
  if (!coordinates instanceof Array || !coordinates.length) {
    throw Error('绘制多边形：传入参数格式错误，应传入数组')
  }
  const id = uuidv4()
  const polygon = new Feature({
    type: 'polygon',
    id,
    geometry: new Polygon([transformLonLat(coordinates)])
  })
  return {
    features: [polygon],
    data: [id]
  }
}
/**
 * 绘制多边形，自定义配置
 * @param {*} opts.name
 * @param {*} opts.id
 * @param {*} opts.fill
 * @param {*} opts.coordinates
 */
export const adPolygon = (opts = {}) => {
  const { data: coordinates, id = uuidv4() } = opts
  if (!coordinates instanceof Array || !coordinates.length) {
    throw Error('绘制多边形：传入参数格式错误，应传入数组')
  }
  const polygon = new Feature({
    type: 'polygon',
    id,
    property: { ...opts },
    geometry: new Polygon([transformLonLat(coordinates)])
  })
  return {
    features: [polygon],
    data: [id]
  }
}