import imgSrc from '../../test/img/icon/2004.png'
import { getLength } from 'ol/sphere'
import { Icon, Style, Stroke, Fill, Text } from 'ol/style'

export { Icon, Style, Stroke, Fill, Text } from 'ol/style'

/**
 * 添加文字
 * @param {*} feature 
 * @param {*} textShow 
 */
export const createText = (feature, textShow = false) => {
  const opts = feature.get('property') || {}
  const name = feature.get('name')
  const { text = {} } = opts
  if (!textShow || !name) return ''
  return new Text({
    textAlign: 'center',
    textBaseline: 'top',
    font: 'bold 12px 微软雅黑',
    text: name,
    fill: new Fill({
      color: feature.get('textColor') || 'green'
    }),
    ...text
  })
}
// 文本
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


/**
 * icon类型
 * @param {*} feature 
 * @param {*} map 
 */
export const style_icon = (feature, map) => {
  const pixel = map.getDistanceFromPixel()
  const src = feature.get('imgType') || imgSrc
  // icon的其他配置
  const { icon = {} } = feature.get('property') || {}
  let textShow = true
  let scale = 0.7
  let anchor = [0.5, 28]
  // if (pixel > 3000) textShow = false
  if (pixel > 500) scale = 0.5
  return new Style({
    image: new Icon({
      anchor,
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      scale,
      src,
      ...icon
    }),
    text: createText(feature, textShow)
  })
}

/**
 * 线段
 * @param {*} feature 
 * @param {*} map 
 */
export const style_lineString = (feature, map) => {
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
  let textShow = true
  if (map) {
    const pixel = map.getDistanceFromPixel()
    if (pixel > 110) textShow = false
  }
  return new Style(normalStyle(textShow))
}



/**
 * 通用样式
 * @param {*} feature 
 * @param {*} options 
 */
export const normalFill = (feature) => {
  // 获取属性
  const { fill, strokeColor, strokeWidth } = feature.get('property') || {}
  const fillColor = fill || 'rgba(255,0,0,0.2)'
  return new Style({
    stroke: new Stroke({
      color: strokeColor || fillColor,
      width: strokeWidth || 1
    }),
    fill: new Fill({
      color: fillColor
    }),
    text: createText(feature, true)
  })
}

/**
 * 获取对应的stule
 * @param {*} methods 
 * @param {*} feature 
 * @param {*} context 
 */
export const getStyle = (methods, feature, context) => {
  const fn = methods[`style_${feature.get('type')}`]
  if (fn) return fn(feature, context)
  return normalFill(feature, context)
}

