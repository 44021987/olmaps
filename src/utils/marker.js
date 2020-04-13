import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import uuidv4 from 'uuid/v4'

import { transformLonLat } from '../common'

export const marker = (markerLst) => {
  if (!markerLst instanceof Array || !markerLst.length) throw Error('绘制点标注：参数格式错误')
  const ids = []
  const features = markerLst.map(item => {
    const { name, img: imgType, drag = false, textColor, longitude, latitude } = item || {}
    // 优先取id，olId 为了兼容老版本
    const id = item.id || item.olId || uuidv4()
    const lonlat = [parseFloat(longitude), parseFloat(latitude)]
    ids.push(id)
    return new Feature({
      type: 'icon',
      name,
      imgType,
      id,
      drag,
      textColor,
      property: { ...item },
      geometry: new Point(transformLonLat(lonlat))
    })

  })
  return {
    features,
    data: ids
  }
}