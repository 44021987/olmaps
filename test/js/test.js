var olmaps = new Olmaps({
  zoom: 15
})
var overlay = olmaps.overlay({
  el: _$id('popup')
})

function _$id(id) {
  return document.getElementById(id)
}

function throttle(fn, interval = 300) {
  const _self = fn
  let timer
  return function (...args) {
    if (timer) {
      return false
    }
    timer = setTimeout(() => {
      clearTimeout(timer)
      timer = null
      _self.apply(this, args)
    }, interval)
  }
}

function closeProp(overlay) {
  _$id('popup-closer').onclick = function () {
    overlay.setPosition(undefined);
    this.blur();
    return false;
  }
}
function resetMap(zoom, type) {
  olmaps.clear()
  olmaps.zoomTo(zoom || 15)
  olmaps.setMapType(type || 0)
  olmaps.setMapCenter(["116.39786446", "39.92421163"])
}

function bindEvent() {
  // 气泡
  olmaps.map.addOverlay(overlay)
  closeProp(overlay)
  olmaps.on('markerClick', function (data) {
    if (data.olId !== '1' && data.olId !== '2') return
    var coordinate = olmaps.transformLonLat(data.coordinates)
    _$id('popup-centent').innerHTML = 'ID：' + data.olId + ' 坐标：' + data.coordinates
    overlay.setPosition(coordinate)
  })
  // map change
  olmaps.on('change', function (data) {
    _$id('center').innerHTML = '地图中心点坐标：' + data.center.join(',')
    // console.log(olmaps.transProj(data.center, 'EPSG:4326', 'EPSG:3857'))
  })
  olmaps.map.on('pointermove', function (evt) {
    var coordinate = olmaps.transProj(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
    _$id('mounse-location').innerHTML = coordinate.join(',')
  })
  olmaps.map.on('click', function (evt) {
    var coordinate = olmaps.transProj(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
    console.log(coordinate)
  })
  // zoom change
  olmaps.map.getView().on('change:resolution', throttle(function (data) {
    // console.log(data)
  }))
}
// 添加点
function init5() {
  resetMap()
  olmaps.addMarker(markers)
}
// 添加线
function init6() {
  resetMap(17)
  olmaps.addLine(lineData)
}
// 多边形
function init7() {
  resetMap()
  olmaps.addPolygon([
    ["116.39786446", "39.92421163"],
    ["116.39676252", "39.92947015"],
    ["116.39503675", "39.92629634"],
    ["116.39476110", "39.92293218"]
  ])
}
var dis = olmaps.getCoordinateLength([
  ["116.39786526", "39.92421163"],
  ["116.39593675", "39.92629634"]
])
console.log(dis)
// 描边
function init8() {
  var oldFeature = null
  resetMap(11)
  olmaps.setMapCenter(geoPoint.boundary[0])
  olmaps.addMultiPolygon({
    data: [geoPoint.boundary],
    name: geoPoint.name,
    id: 'multiPolygon'
  })
  olmaps.pointermove(function (evt, feature) {
    var style = olmaps.style
    if (feature) {
      if (feature == oldFeature && feature.get('id') == 'multiPolygon') {
        feature.setStyle(style.normalFill(feature, {
          fill: 'yellow'
        }))
      }
    } else {
      if (oldFeature) {
        oldFeature.setStyle(style.getStyle(style, oldFeature, olmaps))
      }
    }
    oldFeature = feature
  })
}
function init9() {
  resetMap()
  olmaps.setMapCenter([116.39093675, 39.92999634])
  olmaps.addMarker([{
    "latitude": "39.92999634",
    "longitude": "116.39093675",
    "olId": "1",
    "textColor": "red",
    "name": "点击弹出气泡"
  }])
}

// 主要城市空气质量
function pm25() {
  var currentfeature = null
  var animate = createAnimate()
  var infoDom = createInfoBox()
  var overlay = olmaps.overlay({
    el: animate,
    position: 'center-center'
  })
  var overlay2 = olmaps.overlay({
    el: infoDom,
    position: 'center-bottom'
  })
  function createAnimate() {
    var dom = document.createElement('div')
    dom.id = 'point-animate'
    dom.className = 'point-animate'
    document.body.appendChild(dom)
    return dom
  }
  function createInfoBox() {
    var box = document.createElement('div')
    box.style.backgroundColor = 'rgba(0, 0, 0, .5)'
    box.style.padding = '10px'
    box.style.color = '#ffffff'
    box.style.borderRadius = '3px'
    box.style.transition = 'all .38s'
    return box
  }
  olmaps.clear()
  olmaps.map.getOverlays().clear()
  olmaps.zoomTo(5)
  olmaps.setMapType(3)
  olmaps.setMapCenter([104.87, 34.21])
  data.forEach(function (item) {
    var ids = olmaps.addCircle({
      center: item.center,
      radius: item.value * 120,
      overlay: true,
      fill: 'yellow'
    })
    item.olId = ids[0]
  })
  olmaps.addPolygon(coords)
  olmaps.map.addOverlay(overlay)
  olmaps.map.addOverlay(overlay2)
  olmaps.pointermove(function (evt, feature) {
    var property = feature  && feature.get('property') || {}
    var id = null
    var result = null
    var str = ''
    if (feature &&  property.overlay) {
      if (feature !== currentfeature) {
        currentfeature = feature
        overlay.setPosition(feature.getGeometry().getCenter())
        id = feature.get('id')
        for (var i = 0; i < data.length; i++) {
          if (data[i].olId === id) {
            result = data[i]
            break
          }
        }
        if (!result) return
        str += '<div>'+result.name+'</div>'
        str += '<div>'+result.value+'</div>'
        infoDom.innerHTML = str
        overlay2.setPosition(feature.getGeometry().getCenter())
      }
    } else {
      currentfeature = null
      overlay.setPosition(undefined)
      overlay2.setPosition(undefined)
    }
  })
}