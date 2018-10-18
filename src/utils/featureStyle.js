import {Icon, Style, Stroke, Fill, Text} from 'ol/style'
import { getLength } from 'ol/sphere'
import imgSrc from '../../example/img/icon/2004.png'
const createText = (feature, textShow) => {
  const name = feature.get('name')
  const type = feature.get('type')
  if (!textShow || name === 'false') return ''
  const geometry = feature.getGeometry()
  const dis = type === 'lineString' ? (parseInt(getLength(geometry)) + 'm') : '' 
  return new Text({
    textAlign: 'center',
    textBaseline: 'top',
    font: 'bold 12px 微软雅黑',
    text: name || dis,
    fill: new Fill({
      color: feature.get('textColor') || 'green'
    })
  })
}
export const normalFill = feature => {
  return new Style({
    stroke: new Stroke({
      color: '#f00',
      width: 1
    }),
    fill: new Fill({
      color: 'rgba(255,0,0,0.1)'
    }),
    text: new Text({
      text: feature.get('name') || '',
      font: '18px Calibri,sans-serif',
      fill: new Fill({
        color: 'red'
      }),
      stroke: new Stroke({
        color: 'yellow',
        width: 1
      })
    })
  })
}
export const icon = (feature, map) => {
  const pixel = map.getDistanceFromPixel()
  const src = feature.get('imgType') || imgSrc
  let textShow = true
  let scale = 0.7
  let anchor =[0.5, 28]
  // if (pixel > 3000) textShow = false
  if (pixel > 500) scale = 0.5
  return new Style({
    image: new Icon({
      anchor,
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      scale,
      src
    }),
    text: createText(feature, textShow)
  })
}
export const lineString = (feature, map) => {
  const pixel = map.getDistanceFromPixel()
  const type = feature.get('lineType')
  const normalStyle = textShow => {
    const strokeOpts = {
      color: feature.get('color') || 'red',
      width: 2
    }
    if (type === 'dash') strokeOpts.lineDash = [4]
    const opts = {
      stroke: new Stroke(strokeOpts),
      text: createText(feature, textShow),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)'
      })
    }
    return opts
  }
  let textShow = false
  if (pixel <= 110) textShow = true
  return new Style(normalStyle(textShow))
}
export const circle = (feature) => {
  return normalFill(feature)
}

export const polygon = (feature) => {
  return normalFill(feature)
}

export const text = feature => {
  return new Style({
    stroke: new Stroke({
      color: '#f00',
      width: 1
    }),
    fill: new Fill({
      color: 'rgba(255,0,0,0.1)'
    }),
    text: createText(feature, true)
  })
}
