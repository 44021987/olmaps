import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import {Fill, Stroke, Style, Text} from 'ol/style'

const style = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.4)'
  }),
  stroke: new Stroke({
    color: '#319FD3',
    width: 1
  }),
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: '#000'
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 3
    })
  })
})

const highlightStyle = new Style({
  stroke: new Stroke({
    color: '#f00',
    width: 1
  }),
  fill: new Fill({
    color: 'rgba(255,0,0,0.1)'
  }),
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: '#000'
    }),
    stroke: new Stroke({
      color: '#f00',
      width: 3
    })
  })
})

export const geoLayer = url => {
  return new VectorLayer({
    source: new VectorSource({
      url,
      format: new GeoJSON()
    }),
    style: function(feature) {
      // style.getText().setText(feature.get('name'))
      return style
    }
  })
}

export const bindHighlight = map => {
  const featureOverlay = new VectorLayer({
    source: new VectorSource(),
    map,
    style: function(feature) {
      // highlightStyle.getText().setText(feature.get('name'))
      return highlightStyle
    }
  })
  let highlight
  const displayFeatureInfo = function(pixel) {
    const feature = map.forEachFeatureAtPixel(pixel, function(feature) {
      return feature
    })
    if (feature) {
      // console.log(feature.getId() + ': ' + feature.get('name'))
    }
    if (feature !== highlight) {
      if (highlight) {
        featureOverlay.getSource().removeFeature(highlight)
      }
      if (feature) {
        featureOverlay.getSource().addFeature(feature)
      }
      highlight = feature
    }
  }
  map.on('pointermove', function(evt) {
    if (evt.dragging) {
      return
    }
    const pixel = map.getEventPixel(evt.originalEvent)
    displayFeatureInfo(pixel)
  })
}



