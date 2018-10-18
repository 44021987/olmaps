
import { addMarker } from './addMarker'
import { addLine } from './addLine'
import { addCircle } from './addCircle'
import { addPolygon } from './addPolygon'
import { addMultiPolygon } from './addMultiPolygon'
import * as common from './common'

const utils = {
  addMarker,
  addLine,
  addCircle,
  addPolygon,
  addMultiPolygon
}

for (const key in common) {
  if (typeof common[key] === 'function') utils[key] = common[key]
}

export default utils