import Hilo from 'hilojs'
export default class ResetButton extends Hilo.Container {
  constructor(properties) {
    super(properties)
    this.resetButton(properties)
  }
  resetButton (properties) {
    const buttonName = []

    properties.images.forEach((item, index) => {
      buttonName[index] = new Hilo.Bitmap({
        x: index * 630,
        y: 0,
        image: item,
        rect: properties.rect,
        visible: true,
        scaleX: 1,
        scaleY: 1,
        id: index,
      }).addTo(this)

      const initX = index * 630
      const initY = 0

      buttonName[index].on(Hilo.event.POINTER_START, (e) => {
        Hilo.Tween.to(
          buttonName[index],
          {
            scaleX: 1.05, scaleY: 1.05,
            x: initX - (properties.rect[2] * 0.05) / 2, y: initY - (properties.rect[3] * 0.05) / 2
          },
          {
            duration: 100,
            onComplete () {
              Hilo.Tween.to(
                buttonName[index],
                { scaleX: 1, scaleY: 1, x: initX, y: initY },
                {
                  duration: 300
                }
              )
            }
          }
        )
      })
    })
  }
}
