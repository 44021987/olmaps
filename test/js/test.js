const olmaps = new Olmaps({
  zoom: 15
})
const dis = olmaps.getCoordinateLength([
  ["116.39786526", "39.92421163"],
  ["116.39593675", "39.92629634"]
])
console.log(`距离：${dis}m`)

const overlay = olmaps.overlay({
  el: _$id('popup')
})

function _$id (id) {
  return document.getElementById(id)
}

// 防抖
function throttle (fn, interval = 300) {
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
// 关闭弹出层
function closeProp (overlay) {
  _$id('popup-closer').onclick = function () {
    overlay.setPosition(undefined);
    this.blur();
    return false;
  }
}

// 重置map
function resetMap (zoom, type) {
  olmaps.clear()
  olmaps.zoomTo(zoom || 15)
  olmaps.setMapType(type || 0)
  olmaps.setMapCenter(["116.39786446", "39.92421163"])
}


// 绑定事件
function bindEvent () {
  // 气泡
  olmaps.map.addOverlay(overlay)
  closeProp(overlay)
  olmaps.on('markerClick', function (data) {
    if (data.olId !== '1' && data.olId !== '2') return
    const coordinate = olmaps.transformLonLat(data.coordinates)
    _$id('popup-centent').innerHTML = 'ID：' + data.olId + ' 坐标：' + data.coordinates
    overlay.setPosition(coordinate)
  })
  // map change
  olmaps.on('change', function (data) {
    _$id('center').innerHTML = '地图中心点坐标：' + data.center.join(',')
    console.log(olmaps.mapExtent(), 999)
    // console.log(olmaps.transProj(data.center, 'EPSG:4326', 'EPSG:3857'))
  })
  olmaps.map.on('pointermove', function (evt) {
    const coordinate = olmaps.transProj(evt.coordinate);
    _$id('mounse-location').innerHTML = coordinate.join(',')
  })
  olmaps.map.on('click', function (evt) {
    const coordinate = olmaps.transProj(evt.coordinate);
    console.log(`鼠标点击坐标：${coordinate}`)
  })
  // zoom change
  olmaps.map.getView().on('change:resolution', throttle(function (data) {
    // console.log(data)
  }))

}
// 添加点
function init5 () {
  resetMap()
  olmaps.addMarker(markers, data => {
    console.log(data)
  })
}
// 添加线
function init6 () {
  resetMap(17)
  olmaps.addLine(lineData)
}
// 多边形
function init7 () {
  resetMap()
  const id = olmaps.addPolygon({
    data: [
      ["116.39786446", "39.92421163"],
      ["116.39676252", "39.92947015"],
      ["116.39503675", "39.92629634"],
      ["116.39476110", "39.92293218"]
    ],
    name: '多边形测试',
    id: '887777',
    fill: 'yellow'
  })
  const id2 = olmaps.addPolygon([
    ["116.39786446", "39.92421163"],
    ["116.38676252", "39.92947015"],
    ["116.39503675", "39.92429634"],
    ["116.39476110", "39.92293218"]
  ])
  console.log(id, id2)
}

// 描边
function init8 () {
  let oldFeature = null
  resetMap(11)
  olmaps.setMapCenter(geoPoint.boundary[0])
  olmaps.addMultiPolygon({
    data: [geoPoint.boundary],
    name: geoPoint.name,
    id: 'multiPolygon'
  })
  olmaps.layer.on('postrender', function (e) {
    console.log(55555, e)
  })
  olmaps.pointermove(function (evt, feature) {
    if (feature) {
      if (feature.get('id') == 'multiPolygon') {
        const property = feature.get('property') || {}
        feature.set('property', {
          ...property,
          fill: 'yellow'
        })
        oldFeature = feature
      }
    } else {
      if (oldFeature) {
        const property = oldFeature.get('property') || {}
        oldFeature.set('property', {
          ...property,
          fill: null
        })
        oldFeature = null
      }
    }
  })
}
// 气泡添加
function init9 () {
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
function pm25 () {
  let currentfeature = null
  const animate = createAnimate()
  const infoDom = createInfoBox()
  const overlay = olmaps.overlay({
    el: animate,
    position: 'center-center'
  })
  const overlay2 = olmaps.overlay({
    el: infoDom,
    position: 'center-bottom'
  })

  // 闪烁的气泡
  function createAnimate () {
    const dom = document.createElement('div')
    dom.id = 'point-animate'
    dom.className = 'point-animate'
    document.body.appendChild(dom)
    return dom
  }
  // 气泡的dom
  function createInfoBox () {
    const box = document.createElement('div')
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
  data.forEach(function (item, i) {
    const ids = olmaps.addCircle({
      // name: i + '_',
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
    if (!feature) return
    const property = feature.get('property') || {}
    let id = null
    let result = null
    let str = ''
    if (property.overlay) {
      if (feature !== currentfeature) {
        currentfeature = feature
        overlay.setPosition(feature.getGeometry().getCenter())
        id = feature.get('id')
        for (let i = 0; i < data.length; i++) {
          if (data[i].olId === id) {
            result = data[i]
            break
          }
        }
        if (!result) return
        str += '<div>' + result.name + '</div>'
        str += '<div>' + result.value + '</div>'
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