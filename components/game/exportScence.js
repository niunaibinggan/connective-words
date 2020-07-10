import Hilo from 'hilojs'
import Text from './text'
export default class ExportScence extends Hilo.Container {
  constructor(properties) {
    super(properties)

    this.initBackground(properties)
  }
  initBackground (properties) {
    // 整体背景
    new Hilo.Bitmap({
      x: 0,
      y: 0,
      image: properties.images.bg,
      rect: [0, 0, 1920, 1080],
      visible: true
    }).addTo(this, -1)

    // 时间背景
    new Hilo.Bitmap({
      x: 50,
      y: 40,
      image: properties.images.titleBg,
      rect: [0, 0, 387, 151,],
      visible: true
    }).addTo(this)

    // 时间倒计时
    new Text({
      text: properties.title,
      fontSize: properties.title.length < 9 ? 45 : 45 - Math.round(properties.title.length / 3) * 5,
      bold: true,
      textAlign: 'center',
      textVAlign: 'middle',
      height: 151,
      visible: true,
      cc: 3,
      alpha: 1,
      reTextWidth: 387,
      x: 45,
      y: properties.title.length < 9 ? 50 : 50 + (45 - (45 - Math.round(properties.title.length / 3) * 5)) / 2,
      color: '#ffffff',
    }).addTo(this)
  }
}
