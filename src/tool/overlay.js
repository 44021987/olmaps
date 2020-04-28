import Ovl from 'ol/Overlay'

export const Overlay = Ovl
export const overlay = options => {
  return new Ovl({
    element: options.el,
    autoPan: true,
    positioning: options.position || 'center-top',
    autoPanAnimation: {
      duration: 250
    }
  })
}