import Overlay from 'ol/Overlay'

export const overlay = options => {
  return new Overlay({
    element: options.el,
    autoPan: true,
    positioning: options.position || 'center-top',
    autoPanAnimation: {
      duration: 250
    }
  })
}