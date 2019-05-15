
const scale = window.devicePixelRatio === 1 ? 1 : 2
// export const mapSrc = {
//   google: {
//     gis: `http://mt2.google.cn/vt/lyrs=y@186&hl=zh-CN&gl=cn&scale=${scale}&z={z}&y={y}&x={x}`,
//     normal: `http://mt0.google.cn/vt/lyrs=m@298&hl=zh-CN&gl=cn&scale=${scale}&z={z}&y={y}&x={x}`
//   },
//   gaode: {
//     gis: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=6',
//     normal: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=2&scl=1&style=7',
//     // normal: 'http://webst0{1-4}.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}',
//     // round: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8',
//     round: `http://mt1.google.cn/vt/lyrs=h@298&hl=zh-CN&gl=cn&scale=${scale}&z={z}&y={y}&x={x}`
//   }
// }

export const mapSrc = [
  {
    name: '谷歌地图',
    src: `http://mt0.google.cn/vt/lyrs=m@298&hl=zh-CN&gl=cn&scale=${scale}&z={z}&y={y}&x={x}`,
    visible: true,
    id: '0'
  },
  {
    name: '谷歌影像地图',
    src: `http://mt2.google.cn/vt/lyrs=y@186&hl=zh-CN&gl=cn&scale=${scale}&z={z}&y={y}&x={x}`,
    visible: false,
    id: '1'
  },
  {
    name: '高德地图',
    src: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=2&scl=1&style=7',
    visible: false,
    id: '2'
  },
  {
    name: '高德影像地图',
    src: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=6',
    visible: false,
    id: '3'
  }
]

export const devicePixelRatio = scale
export const pixelNum = 50

export const startDI = '-startDI'
export const endDI = '-endDI'
export const lineDI = '-lineDI'

