import Feature from 'ol/Feature'
import Circle from 'ol/geom/Circle'
import uuidv4 from 'uuid/v4'

import {transformLonLat} from '../common'

/**
 * 
 * @param {Array} center 
 * @param {Nunber} radius default is 0
 * @return {Object} feature data and feature id
 */
export const addCircle = (center, radius=0) => {
  if (!radius) return
  const id = uuidv4()
  const circle = new Feature({
    type: 'circle',
    id: id,
    radius,
    geometry: new Circle(transformLonLat(center), radius)
  })
  return {
    features: [circle],
    data: [id]
  }
}
