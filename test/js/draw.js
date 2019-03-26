const olmaps = new Olmaps({
  zoom: 15
})
const draw = olmaps.draw()
let drawStartPoint = null
let currentPoint = null
const toolTip = addTooltip(olmaps.map)
console.log(olmaps)
olmaps.setMapType(1)
olmaps.addLine([{
  data: [
    [116.39875173568724, 39.931541254699965],
    [116.40360116958617, 39.92614413035804]
  ],
  showDistance: true,
  textColor: 'red'
}])
// drawBox(olmaps.map, draw)
drawLineString(olmaps.map)

function drawLineString(map) {
  const draw = olmaps.draw('LineString')
  const vector = draw.vector
  const drawFeature = draw.feature
  map.addLayer(vector)
  map.addInteraction(drawFeature)
  drawFeature.on('drawstart', drawstart, this)
}
// 长方形
function drawBox(map, draw) {
  const vector = draw.vector
  const drawFeature = draw.feature
  map.addLayer(vector)
  map.addInteraction(drawFeature)
  drawFeature.on('drawstart', function (evt) {
    const geometry = evt.feature.getGeometry()
    // const coordinate = geometry.getCoordinates()[0]

    geometry.on('change', function (evt) {
      const geom = evt.target;
      const out = formatArea(geom, map);
      const tooltipCoord = geom.getInteriorPoint().getCoordinates(); //坐标
      document.querySelector('.info').innerHTML = out;
      toolTip.setPosition(tooltipCoord);
    });
  })
  drawFeature.on('drawend', function (evt) {
    const coordinate = evt.feature.getGeometry().getCoordinates()[0]
    const coordinateTrans = olmaps.transProj(coordinate, 'EPSG:3857', 'EPSG:4326');
    coordinateTrans.forEach(item => {
      olmaps.addCircle({
        center: item,
        radius: 30
      })
    })
    olmaps.map.removeInteraction(draw.feature)
  })
}

function drawstart(evt) {
  const geometry = evt.feature.getGeometry()
  const mode = evt.target.mode_
  const el = document.querySelector('.info')
  geometry.on('change', function (e) {
    const geom = e.target;
    let out = null
    let tooltipCoord = null
    if (mode === 'LineString') {
      const len = olmaps.getCoordinateLength(olmaps.transProj(geometry.getCoordinates()))
      tooltipCoord = geometry.getCoordinates().shift()
      out = len > 1000 ? len /1000 + 'km' : len + 'm'
    } else {
      out = formatArea(geom, map)
      tooltipCoord = geom.getInteriorPoint().getCoordinates()
    }
    el.innerHTML = out;
    toolTip.setPosition(tooltipCoord);
  });

}
/**
 * 提示信息显示
 * @param {olmaps.map} map 
 * @return {Object} overlay
 */
function addTooltip(map) {
  const overlay = olmaps.overlay({
    el: document.querySelector('.info')
  })
  map.addOverlay(overlay)
  return overlay
}
/**
 * 测量面积输出
 * @param {ol.geom.Polygon} polygon
 * @return {string}
 */
function formatArea(polygon, map) {
  const area = polygon.getArea()
  let output;
  if (area > 10000) {
    output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>'
  } else {
    output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>'
  }
  return output
};