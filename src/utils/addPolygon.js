import Feature from 'ol/Feature'
import {Polygon} from 'ol/geom.js'
import uuidv4 from 'uuid/v4'
import {transformLonLat} from '../common'

export const polygon = (coordinates) => {
  if (!Array.isArray(coordinates) || !coordinates.length) return
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