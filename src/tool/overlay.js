import Overlay from 'ol/Overlay'

export const overlay = id => {
  return new Overlay({
    element: document.getElementById(id),
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  })
}