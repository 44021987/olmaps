<!-- [TOC] -->

# Olmaps API

**基于 openlayers5 的封装**

默认传入和返回的经纬度都是 EPSG:4326 坐标体系，如使用其他的坐标系需要经过转换，地图内部使用的 EPSG:3857 坐标系。<br/>**代码中所有瓦片数据均来源于网络，仅用做学习之用，如有侵权可联系 44021987@qq.com 删除，谢谢！**

## 使用

- 浏览器直接引入 dist 目录下 index.js
- npm 安装

  > npm install olmaps --save

```html
<div id="map" style="width: 500px;height: 500px"></div>
```

```js
import Olmaps from 'olmaps'

const olmaps = new Olmaps()
console.log(olmaps.getZoom())
```

```js
const olmaps =new Olmaps({
  target: 'map'
  center: [116.39786526, 39.92421163],
  zoom: 16 ,
  minZoom: 10,
  maxZoom: 20,
  // 自定义图层，根据唯一标识id切换，id不可重复
  mapSrc: [
    {
      name: '谷歌地图',
      src: `http://mt0.google.cn/vt/lyrs=m@298&hl=zh-CN&gl=cn&scale=${scale}&z={z}&y={y}&x={x}`,
      visible: true,
      id: '0' // 唯一标识
    }
  ]
})

```

| variable        | description          | type    | default                                                      |
| --------------- | -------------------- | ------- | ------------------------------------------------------------ |
| target          | dom 元素的 id        | String  | map                                                          |
| center          | 初始化地图中心点坐标 | Array   | [116.39786526, 39.92421163]                                  |
| zoom            | 地图初始化层级       | Number  | 16                                                           |
| minZoom         | 最小缩放层级         | Number  | 3                                                            |
| maxZoom         | 最大缩放层级         | Number  | 20                                                           |
| mapSrc          | 自定义图层           | Array   | 支持自定义传入，不传入默认 '0' 谷歌行政图， '1' 谷歌影像图 ，'2' 高德行政图， '3' 高德影像图 |
| pinchRotate     | 手指旋转             | Boolean | false                                                        |
| doubleClickZoom | 是否双击放大         | Boolean | false                                                        |
| scaleLine       | 比例尺显示           | Boolean | true                                                         |

## 1、Methods

### setMapCenter 

设置地图中心点

```
olmaps.setMapCenter([116.39786526, 39.92421163])
```

### setMapType 

切换地图类型

- 默认支持以下四种类型地图

```
olmaps.setMapType('0')
```

| variable | description                                                 |
| -------- | ----------------------------------------------------------- |
| type     | '0' 谷歌行政图 '1' 谷歌影像图 '2' 高德行政图 '3' 高德影像图 |

添加自定义图层

- 支持添加多个，type 为切换地图类型时使用

```js
const olmaps = new Olmaps({
  zoom: 15,
  mapSrc: [
    {
      name: '高德道路地图', // 名称
      src:
        'http://mt1.google.cn/vt/lyrs=h@298&hl=zh-CN&gl=cn&scale=1&z={z}&y={y}&x={x}', // 地址
      visible: true, // 是否显示
      id: '66' // 类型id 必须唯一
    }
  ]
})
```

### getZoom 

获取当前缩放层级

```
const zoom = olmaps.getZoom()
```

| variable | description |
| -------- | ----------- |
| zoom     | 缩放层级    |

### getCenter 

获取当前中心点坐标

```
const center = olmaps.getCenter()
// 出参
[116.39786526, 39.92421163]
```

### ~~获取请求地址~~

```js
const resultUrl = olmaps.getRequestUrl(callback)
```

### zoomIn 

放大一个层级

```js
olmaps.zoomIn()
```

### zoomOut 

缩小一个层级

```js
olmaps.zoomOut()
```

### zoomTo 

设置层级大小

```js
olmaps.zoomTo(15)
```

### getCoordinateLength 

获取 2 个经纬度之间的直线距离

```
const dis = olmaps.getCoordinateLength([
  ["116.39786526", "39.92421163"],
  ["116.39593675", "39.92629634"]
])
```

### transformLonLat 

4326坐标系转3857

```js
const res = transformLonLat([116.39786526,39.92421163])
```

### transProj 

坐标系互转，默认从2857转4326

```js
const res =transProj(lonLatArr, oldproj = 'EPSG:3857', newproj = 'EPSG:4326')
```

### addLayer 

添加layer

### getZoomWidthDis 

传入一个距离，获取视野范围内最适合的层级  

### mapExtent 

获取视野范围4个角的经纬度

## 2、绘制覆盖物

### addMarker 绘制点标记

```
const markerInfo = olmaps.addMarker([
  {
    "latitude":"39.92421163",
    "longitude":"116.39786526",
    "name":"单杆-1",
    "type": "",
    "drag": true
  },
  {
    "latitude":"39.92629634",
    "longitude":"116.39593675",
    "name":"单杆-10",
    "type": ""
  }
])

// markerInfo
{
  "latitude":"28.174730774025367",
  "longitude":"112.9790183901787",
  "name":"单杆-10",
  "type": "",
  olId: 'uuid'
}
```

| variable  | description               | type    | default |
| --------- | ------------------------- | ------- | ------- |
| latitude  | 纬度                      |         |         |
| longitude | 经度                      |         |         |
| name      | 点位名称                  | String  |         |
| img       | 图标地址                  | String  |         |
| drag      | 是否可拖拽                | Booleab | false   |
| id        | 点位标识                  |         | uuid    |
| text      | 文字其他属性参考 ol6 文档 | Object  |         |
| icon      | 图标其他属性参考 ol6 文档 | Object  |         |

### addLine 绘制线集合

```js
// 入参
const info = olmaps.addLine([
  {
    data: [
      ['116.39786526', '39.92421163'],
      ['116.39593675', '39.92629634']
    ],
    color: 'green',
    textColor: 'green',
    showDistance: true,
    type: 'dash'
  },
  {
    data: [
      ['116.39593675', '39.92629634'],
      ['116.39670252', '39.92647015']
    ],
    color: 'red',
    textColor: 'green',
    showDistance: false,
    type: 'line'
  },
  {
    data: [
      ['116.39670252', '39.92647015'],
      ['116.39473110', '39.92293218']
    ],
    color: 'green',
    textColor: 'red',
    showDistance: true,
    type: 'line'
  }
])[
  // result -> info
  ({
    data: [
      ['116.39786526', '39.92421163'],
      ['116.39593675', '39.92629634']
    ],
    color: 'green',
    textColor: 'green',
    showDistance: true,
    type: 'dash',
    olId: 'd1afa649-6b73-4fad-ab49-801e256da11b'
  },
  {
    data: [
      ['116.39593675', '39.92629634'],
      ['116.39670252', '39.92647015']
    ],
    color: 'red',
    textColor: 'green',
    showDistance: false,
    type: 'line',
    olId: 'd1afa649-6b73-4fad-ab49-801e256da11b'
  },
  {
    data: [
      ['116.39670252', '39.92647015'],
      ['116.39473110', '39.92293218']
    ],
    color: 'green',
    textColor: 'red',
    showDistance: true,
    type: 'line',
    olId: 'd1afa649-6b73-4fad-ab49-801e256da11b'
  })
]
```

| variable     | type           | description         | default |
| ------------ | -------------- | ------------------- | ------- |
| data         | Array          | 经纬度数组集合      | 无      |
| type         | String         | line 实线 dash 虚线 | line    |
| color        | 16 进制 / rgba | 线条颜色            | red     |
| textColor    | 16 进制 / rgba | 距离的字体颜色      | green   |
| showDistance | Boolean        | 是否显示距离        | true    |
| id           | String         | 点位标识            |

### addCircle 绘制圆形

一次只绘制一个

```
const info = olmaps.addCircle({
  center: [116.39786526, 39.92421163],
  radius: 100
})

// return -> info
["689dc349-2bfa-4eed-8173-82cc2c76cacb"]
```

| variable    | description               | type   | default           |
| ----------- | ------------------------- | ------ | ----------------- |
| id          | 唯一标识                  | String | uuid              |
| name        | 名称                      | String |                   |
| center      | 中心点经度纬度            | Array  | ———               |
| radius      | 圆的半径（单位米）        | String |                   |
| textColor   | 文字颜色                  | String | green             |
| text        | 文字其他属性参考 ol6 文档 | Object |                   |
| fill        | 填充颜色                  | String | rgba(255,0,0,0.1) |
| strokeColor | 边框颜色                  | String | rgba(255,0,0,0.1) |
| strokeWidth |                           | Number | 1                 |

### addPolygon 绘制多边形

- 绘制多边形(一次只绘制一个)

```js
const info = olmaps.addPolygon({
  data: [
    ["116.39786526","39.92421163"],
    ["116.39593675","39.92629634"],
    ["116.39670252","39.92647015"],
    ["116.39473110","39.92293218"]
  ],
  id: '887777',
  fill: 'yellow'
})
| variable    | description               | type   | default           |
| ----------- | ------------------------- | ------ | ----------------- |
| id          | 唯一标识                  | String | uuid              |
| name        | 名称                      | String |                   |
| data      | 经度纬度集合           | Array  | ———               |
| textColor   | 文字颜色                  | String | green             |
| text        | 文字其他属性参考 ol6 文档 | Object |                   |
| fill        | 填充颜色                  | String | rgba(255,0,0,0.1) |
| strokeColor | 边框颜色                  | String | rgba(255,0,0,0.1) |
| strokeWidth |                           | Number | 1                 |

// return
["689dc349-2bfa-4eed-8173-82cc2c76cacb"]
```

### addMultiPolygon 描点（描边）

- 特别注意这里需要传入 data 的数组格式

```
const info = olmaps.addMultiPolygon({
  data: [
    [
      ["116.39786526","39.92421163"],
      ["116.39593675","39.92629634"],
      ["116.39670252","39.92647015"],
      ["116.39473110","39.92293218"]
    ]
  ],
  name: '',
  id: ''
})
```

| opts | type   | description |
| ---- | ------ | ----------- |
| data | Array  | 经纬度集合  |
| name | String |
| id   | String | 唯一标识    |

### ~~点线集合~~

- 绘制一组实时显示距离的点线集合
- 返回 id 集合用于删除该组数据

### removeFeature 删除覆盖物

- 所有增加的覆盖物都可通过此方法单独删除
- ids 为标识集合（只删除一个也传 list）

```
olmaps.removeFeature([
  '81f2e09f-ce04-42ac-92f1-98c3d51cc585'
  '81f2e09f-ce04-42ac-92f1-98c3d51cc586'
])

```

### clear 清除 所有覆盖物

```js
olmaps.clear()
```

### getAllFeatures 获取所有覆盖物

```js
olmaps.getAllFeatures()
```

## 3、Events

### change 地图移动的监听

- 返回移动后的地图中心点坐标

```js
olmaps.on('change', function(result) {
})
// result
{
  center: [116.3945817898568, 39.89847346897744],
  zoom: 16
}
```

### markerDrag 标记拖动回调

```js
olmaps.on('markerDrag', function(result) {
})
// result
{
  "oldCoordinates":[116.39786526,39.92421163],
  "coordinates":[116.39917417799927,39.92202294744385],
  "olId":"68b22fa0-34cd-49bb-8083-a0a36543fa77"
}
```

| variable       | description    |
| -------------- | -------------- |
| coordinates    | 返回拖动后坐标 |
| oldCoordinates | 拖动前坐标     |
| olId           | 被拖动点位标识 |

### markerClick 标记点击回调

```js
olmaps.on('markerClick', function(result) {
})
// result
{
  "coordinates":[116.39786526,39.92421163],
  "olId":"68b22fa0-34cd-49bb-8083-a0a36543fa77"
}
```

### markerLongClick 标记长按回调

```js
olmaps.on('markerLongClick', function(result) {
})
// result
{
  "coordinates":[116.39786526,39.92421163],
  "olId":"68b22fa0-34cd-49bb-8083-a0a36543fa77"
}
```

### olmaps.map

返回 map 实例，map 上的其他操作参考 openlayers 的官方 API


