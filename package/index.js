import {easeOut} from 'ol/easing'
import {unByKey} from 'ol/Observable'
import { ol } from '../src/map'
import * as tool from '../tool'
import * as common from '../src/common'
import {circleAnimate} from '../src/utils/featureStyle'


const methods = {
  easeOut,
  unByKey,
  ...tool,
  ...common,
  circleAnimate
}

for (const key in methods) {
  if (typeof methods[key] === 'function') ol.prototype[key] = methods[key]
  
}
export const Olmaps = ol