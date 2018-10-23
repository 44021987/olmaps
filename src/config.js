
const scale = window.devicePixelRatio === 1 ? 1 : 2
export const mapSrc = {
  google: {
    gis: `http://mt2.google.cn/vt/lyrs=y@186&hl=zh-CN&gl=cn&scale=${scale}&z={z}&y={y}&x={x}`,
    normal: `http://mt0.google.cn/vt/lyrs=m@298&hl=zh-CN&gl=cn&scale=${scale}&z={z}&y={y}&x={x}`
  },
  gaode: {
    gis: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=6',
    normal: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=2&scl=1&style=7',
    // normal: 'http://webst0{1-4}.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}',
    // round: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8',
    round: `http://mt1.google.cn/vt/lyrs=h@298&hl=zh-CN&gl=cn&scale=${scale}&z={z}&y={y}&x={x}`
  }
}

export const devicePixelRatio = scale
export const pixelNum = 50

export const startDI = '-startDI'
export const endDI = '-endDI'
export const lineDI = '-lineDI'

