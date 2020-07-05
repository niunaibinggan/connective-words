import Hilo from 'hilojs'
export default class SubmitButton extends Hilo.Container {
  constructor(properties) {
    super(properties)
    this.submit(properties)
  }
  submit (properties) {
    // 提交按钮
    const sub = new Hilo.Bitmap({
      x: 0,
      y: 0,
      image: properties.images,
      rect: properties.rect,
      visible: true,
      scaleX: 1,
      scaleY: 1
    }).addTo(this)

    sub.on(Hilo.event.POINTER_START, (e) => {
      Hilo.Tween.to(
        sub,
        {
          scaleX: 1.05, scaleY: 1.05,
          x: -(properties.rect[2] * 0.05) / 2, y: -(properties.rect[3] * 0.05) / 2
        },
        {
          duration: 100,
          onComplete () {
            Hilo.Tween.to(
              sub,
              { scaleX: 1, scaleY: 1, x: 0, y: 0 },
              {
                duration: 300
              }
            )
          }
        }
      )
    })

  }
}
