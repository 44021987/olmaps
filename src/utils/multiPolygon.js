import Feature from 'ol/Feature'
import MultiPolygon from 'ol/geom/MultiPolygon'
import uuidv4 from 'uuid/v4'

import {transformLonLat} from '../common'
import {isObject} from '../public'

export const multiPolygon = opts => {
  if (!isObject(opts) || !Array.isArray(opts.data) || !opts.data.length) throw new Error('addMultiPolygon 参数错误')
  const id = opts.id || uuidv4()
  const polygon = new Feature({
    type: 'multiPolygon',
    name: opts.name,
    id,
    property: opts.property || {},
    geometry: new MultiPolygon([transformLonLat(opts.data)])
  })
  return {
    features: [polygon],
    data: [id]
  }
}
