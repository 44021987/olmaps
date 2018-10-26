import Feature from 'ol/Feature'
import LineString from 'ol/geom/LineString'
// import { getLength } from 'ol/sphere'
import uuidv4 from 'uuid/v4'

import {transformLonLat} from '../common'

/**
 * 
 * @param {Array} linearr 
 * @returns {Object}
 */
export const lineString = (linearr) => {
  if (!Array.isArray(linearr) || !linearr.length) return
  const arr = []
  linearr.forEach((item, i) => {
    const data = item.data
    if (!Array.isArray(data) || !data.length) return
    const geometry = new LineString(transformLonLat(data))
    let dis = ''
    // if (item.showDistance !== false) dis = parseInt(getLength(geometry)) + 'm'
    const id = item.olId || uuidv4()
    const line = new Feature({
      type: 'lineString',
      name: item.showDistance === true ? (item.name || '') : 'false',
      id,
      color: item.color || '',
      lineType: item.type === 'line' ? 'line' : 'dash',
      textColor: item.textColor || '',
      geometry
    })
    item.olId = id
    arr.push(line)
  })
  return {
    features: arr,
    data: linearr
  }
}