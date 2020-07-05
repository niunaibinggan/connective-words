import Hilo from 'hilojs'
export default class ResultModel extends Hilo.Container {
  constructor(properties) {
    super(properties)
    this.model(properties)
  }
  model (properties) {

    const readyImage = properties.isAllRight ? properties.images.rightModel : properties.images.errorModel

    new Hilo.Bitmap({
      x: 0,
      y: 0,
      image: readyImage,
      rect: properties.rect,
    }).addTo(this)

  }
}
