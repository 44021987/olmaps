import Draw, {createBox} from 'ol/interaction/Draw';
import {Vector as VectorLayer} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source';
const source = new VectorSource({wrapX: false})
const vector = new VectorLayer({
  source: source
});
export const draw = (type = 'box') => {
  const params = {source}
  if (type)
  switch (type) {
    case 'box':
      Object.assign(params, {
        type: 'Circle',
        geometryFunction: createBox()
      })
      break;
    case 'LineString':
      Object.assign(params, {
        type
      })
    break;
    default:
      console.error('参数错误')
      break;
  }
  return {
    feature: new Draw(params),
    vector
  }
}