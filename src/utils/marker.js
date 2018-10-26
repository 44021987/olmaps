import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import uuidv4 from 'uuid/v4'

import {transformLonLat} from '../common'

export const marker = (pointarr) => {
  const arr = []
  if (!Array.isArray(pointarr) || !pointarr.length) return
  pointarr.forEach(item => {
    item.olId = item.olId || uuidv4() 
    const lonlat = [parseFloat(item.longitude), parseFloat(item.latitude)]
    const point = new Feature({
      type: 'icon',
      name: item.name,
      imgType: item.img ,
      id: item.olId,
      drag: item.drag || false,
      textColor: item.textColor || '',
      geometry: new Point(transformLonLat(lonlat))
    })
    arr.push(point)
  })
  return {
    features: arr,
    data: pointarr
  }
}