import Feature from 'ol/Feature'
import LineString from 'ol/geom/LineString'
import { getLength } from 'ol/sphere'
import uuidv4 from 'uuid/v4'

import { transformLonLat } from '../common'

/**
 * 绘制直线
 * @param {Array} linearr 
 * @returns {Object}
 */
export const lineString = (linearr) => {
  if (!Array.isArray(linearr) || !linearr.length) throw Error('绘制line：参数格式错误')
  const ids = []
  const features = linearr.map((item, i) => {
    const { name = '', data, color, type = 'line', textColor, showDistance } = item || {}
    if (!data instanceof Array || !data.length) return
    const id = item.id || item.olId || uuidv4()
    const geometry = new LineString(transformLonLat(data))
    console.log(typeof showDistance)
    ids.push(id)
    return new Feature({
      type: 'lineString',
      name: showDistance === true ? `${parseInt(getLength(geometry))}m` : name,
      id,
      color,
      property: { ...item },
      // 不是直线就是虚线
      lineType: type === 'line' ? 'line' : 'dash',
      textColor,
      geometry
    })

  })
  return {
    features,
    data: ids
  }
}