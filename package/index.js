import { ol } from '../src/map'
import * as tool from '../tool'
import * as common from '../src/common'


const methods = {
  ...tool,
  ...common
}

for (const key in methods) {
  if (typeof methods[key] === 'function') ol.prototype[key] = methods[key]
  
}
export const Olmaps = ol