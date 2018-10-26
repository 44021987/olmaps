[TOC]
## Olmaps API
**基于openlayers5的封装**

默认传入和返回的经纬度都是EPSG:4326坐标体系，如使用其他的坐标系需要经过转换。地图内部使用的EPSG:3857坐标系。
### 使用
- 浏览器直接引入dist目录下index.js
- npm 安装

```
npm install olmaps --save
import Olmaps form 'olmaps'

const olmaps =new Olmaps()
olmaps.getZoom()
olmaps.addCircle({
  center: [116.39786526, 39.92421163],
  radius: 100
})
```

### 1.基本操作
##### 初始化
- 初始化地图
- 返回map实例
```
const olmaps =new Olmaps({
  target: 'map'
  center: [116.39786526, 39.92421163],
  zoom: 16 ,
  minZoom: 10,
  maxZoom: 20
})

```
variable | description | default
--- | --- | ---
target | dom元素的id | map
center | 初始化地图中心点坐标 | 无
zoom | 地图初始化层级 | 16
minZoom | 最小缩放层级 | 10
maxZoom | 最大缩放层级 | 20
##### 设置地图中心点
```
olmaps.setMapCenter([116.39786526, 39.92421163])
```
##### 切换地图类型
```
olmaps.setMapType(0)
```

variable | description
--- | ---
type  | 0 谷歌行政图 1 谷歌影像图 2 高德行政图 3 高德影像图

##### 获取当前缩放层级
```
const zoom = olmaps.getZoom()
```

variable | description
--- | ---
zoom | 缩放层级

##### 获取当前中心点坐标

```
const center = olmaps.getCenter()
// 出参
[116.39786526, 39.92421163]
```
##### 获取请求地址
```js
const resultUrl = olmaps.getRequestUrl(callback)
```
variable | description
--- | ---
google | 谷歌
gaode | 高德

##### 放大一个层级
```js
olmaps.zoomIn()
```
##### 缩小一个层级
```js
olmaps.zoomOut()
```

##### 设置层级大小
```js
olmaps.zoomTo(15)
```


##### 获取2个经纬度直接的直线距离
```
const dis = olmaps.getCoordinateLength([
  ["116.39786526", "39.92421163"],
  ["116.39593675", "39.92629634"]
])
```

### 2.绘制覆盖物
##### 绘制点标记
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
variable | description | default
--- | --- | ---
latitude | 纬度
longitude | 经度
name | 点位名称
type | 点位类型
drag | true可拖拽 false不可拖拽 | false
olId | 点位标识

##### 画线：实线和虚线用type做区分
```
// 入参
const info = olmaps.addLine([
  {
    "data":[
      ["116.39786526","39.92421163"],
      ["116.39593675","39.92629634"]
    ],
    "color":"green",
    "textColor":"green",
    "showDistance":true,
    "type": "dash"
  },
  {
    "data":[
      ["116.39593675","39.92629634"],
      ["116.39670252","39.92647015"]
    ],
    "color":"red",
    "textColor":"green",
    "showDistance":false,
    "type": "line"
  },
  {
    "data":[
      ["116.39670252","39.92647015"],
      ["116.39473110","39.92293218"]
    ],
    "color":"green",
    "textColor":"red",
    "showDistance":true,
    "type": "line"
  }
])


// result -> info
[
  {
    "data":[
      ["116.39786526","39.92421163"],
      ["116.39593675","39.92629634"]
    ],
    "color":"green",
    "textColor":"green",
    "showDistance":true,
    "type": "dash",
    "olId": "d1afa649-6b73-4fad-ab49-801e256da11b"
  },
  {
    "data":[
      ["116.39593675","39.92629634"],
      ["116.39670252","39.92647015"]
    ],
    "color":"red",
    "textColor":"green",
    "showDistance":false,
    "type": "line",
    "olId": "d1afa649-6b73-4fad-ab49-801e256da11b"
  },
  {
    "data":[
      ["116.39670252","39.92647015"],
      ["116.39473110","39.92293218"]
    ],
    "color":"green",
    "textColor":"red",
    "showDistance":true,
    "type": "line",
    "olId": "d1afa649-6b73-4fad-ab49-801e256da11b"
  }
]

```
variable | type | description | default
--- | --- | --- | ---
data | Array | 经纬度数组集合 | 无
type | String | line 实线 dash 虚线 | line
color | 16进制 / rgba  | 线条颜色 | red
textColor | 16进制 / rgba  | 距离的字体颜色 | green
showDistance | Boolean | 是否显示距离 | true
olId  | String | 点位标识 | 

##### 绘制圆形
- 一次只绘制一个
```
const info = olmaps.addCircle({
  center: [116.39786526, 39.92421163],
  radius: 100
})

// return -> info
["689dc349-2bfa-4eed-8173-82cc2c76cacb"]
```
variable | type | description
--- | --- | ---
center | Array | 中心点经度纬度
radius| String | 圆的半径（单位米）

##### 绘制多边形
- 绘制多边形(一次只绘制一个)
```
const info = olmaps.addPolygon([
  ["116.39786526","39.92421163"],
  ["116.39593675","39.92629634"],
  ["116.39670252","39.92647015"],
  ["116.39473110","39.92293218"]
])

// return
["689dc349-2bfa-4eed-8173-82cc2c76cacb"]
```

##### 描点（描边）
- 特别注意这里需要传入data的数组格式
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
opts | type | description
--- | --- | ---
data | Array | 经纬度集合
name | String | 
id | String | 唯一标识

##### 点线集合
- 绘制一组实时显示距离的点线集合
- 返回id集合用于删除该组数据
```
const info = olmaps.calculateGroup({
  "data":[
    ["116.39786526","39.92421163"],
    ["116.39593675","39.92629634"]
  ],
  "color":"green",
  "textColor":"red",
  "showDistance":true,
  "type": "dash"
})

// return
[
  "addf8144-ce43-4143-9dfc-02ff85d2e920-startDI", 
  "addf8144-ce43-4143-9dfc-02ff85d2e920-endDI", 
  "addf8144-ce43-4143-9dfc-02ff85d2e920-lineDI"
]
```

### 3.删除操作
##### 删除单个或多个覆盖物
- 所有增加的覆盖物都可通过此方法单独删除
- ids为标识集合（只删除一个也传list）
```
olmaps.removeFeature([
  '81f2e09f-ce04-42ac-92f1-98c3d51cc585'
  '81f2e09f-ce04-42ac-92f1-98c3d51cc586'
])

```
##### 
- 清除map中所有覆盖物
```js
olmaps.clear()
```

### 4.事件监听

##### 地图移动的监听
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

##### 标记拖动回调
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
variable | description
--- | --- 
coordinates | 返回拖动后坐标
oldCoordinates| 拖动前坐标
olId | 被拖动点位标识


##### 标记点击回调
```js
olmaps.on('markerClick', function(result) {
})
// result
{
  "coordinates":[116.39786526,39.92421163],
  "olId":"68b22fa0-34cd-49bb-8083-a0a36543fa77"
}
```

##### 标记长按回调
```js
olmaps.on('markerLongClick', function(result) {
})
// result
{
  "coordinates":[116.39786526,39.92421163],
  "olId":"68b22fa0-34cd-49bb-8083-a0a36543fa77"
}
```
##### olmaps.map
返回map实例，map上的其他操作参考openlayers的官方API

### 5.工具方法

```js
olmaps.addLayer()
olmaps.getAllFeatures()
olmaps.transformLonLat()
olmaps.transProj()

```
#### 添加图层
olmaps.addLayer(olmaps, features)

#### 获取map所有覆盖物
olmaps.getAllFeatures(olmaps.map)

#### 转换经纬度到默认坐标系
4326转换成3857
olmaps.transformLonLat([116.39786526, 39.924211629999974])

#### 坐标系互转
olmaps.transProj(lonLatArr, oldproj='EPSG:3857', newproj='EPSG:4326')

