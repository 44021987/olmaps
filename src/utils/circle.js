import Feature from 'ol/Feature'
import Circle from 'ol/geom/Circle'
import uuidv4 from 'uuid/v4'

import {
  transformLonLat
} from '../common'

/**
 * 绘制圆形
 * @param {Array} opts.center
 * @param {Nunber} opts.radius default is 0
 * @return {Object} feature data and feature id
 */
export const circle = (opts = {}) => {
  const { radius, center, fill, id = uuidv4() } = opts
  if (!radius) throw Error('radius传参错误')
  if (!center instanceof Array) throw Error('中心点坐标格式错误')
  const circle = new Feature({
    type: 'circle',
    id,
    radius,
    fill,
    property: { ...opts },
    geometry: new Circle(transformLonLat(center), radius)
  })
  return {
    features: [circle],
    data: [id]
  }
}
