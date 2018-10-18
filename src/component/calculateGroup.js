import uuidv4 from 'uuid/v4'
import {startDI, endDI, lineDI} from '../config'

export const calculateGroup = (opts, ol) => {
  if (!Array.isArray(opts.data) || !opts.data.length) return []
  const uid = uuidv4()
  const points = opts.data
  const startPoint = points[0]
  const endPoint = points[1]
  const markers = ol.addMarker([{
    'longitude':startPoint[0],
    'latitude':startPoint[1],
    'drag': false,
    'olId': uid + startDI

  }, {
    'longitude':endPoint[0],
    'latitude':endPoint[1],
    'type': '2003',
    'drag': true,
    'olId': uid + endDI
  }])
  const line = ol.addLine([
    {
      'data': points,
      'color': opts.color,
      'textColor': opts.textColor,
      'showDistance': true,
      'olId': uid + lineDI,
      'type': opts.type
    }
  ])
  return [uid + startDI, uid + endDI, uid + lineDI]

}