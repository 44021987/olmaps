import Feature from 'ol/Feature'
import Circle from 'ol/geom/Circle'
import uuidv4 from 'uuid/v4'

import {
  transformLonLat
} from '../common'

/**
 * 
 * @param {Array} center 
 * @param {Nunber} radius default is 0
 * @return {Object} feature data and feature id
 */
export const circle = (opts) => {
  if (!opts.radius) return
  const id = opts.id || uuidv4()
  const circle = new Feature({
    type: 'circle',
    id,
    radius: opts.radius,
    fill: opts.fill,
    property: opts,
    geometry: new Circle(transformLonLat(opts.center), opts.radius)
  })
  return {
    features: [circle],
    data: [id]
  }
}
