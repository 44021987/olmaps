import Draw, { createBox } from 'ol/interaction/Draw';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
const source = new VectorSource({ wrapX: false })
const vector = new VectorLayer({
  source: source
});
/**
 * 绘制线、面
 * @param {*} type Box LineString
 */
export const draw = (type = 'Box') => {
  let geometryFunction;
  if (type === 'Box') {
    type = 'Circle'
    geometryFunction = createBox()
  }
  
  return {
    feature: new Draw({
      source,
      type,
      geometryFunction
    }),
    vector
  }
}