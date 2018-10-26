
import { Ol } from '../src/map'
import * as tool from '../tool'

const methods = {
  ...tool
}

for (const key in methods) {
  Ol.prototype[key] = methods[key]
  
}
export const Olmaps = Ol