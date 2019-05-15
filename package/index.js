
import { Ol } from '../src/map'
import * as tool from '../tool'

import '../node_modules/ol/ol.css'

const methods = {
  ...tool
}

for (const key in methods) {
  Ol.prototype[key] = methods[key]
  
}
export const Olmaps = Ol