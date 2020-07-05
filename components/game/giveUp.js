drawLine() {
  if (!this.verifyRepeat()) return
  const line = new Hilo.Graphics({
    width: 1,
    height: 1,
    x: this.leftX + 500,
    y: this.top,
    scaleX: 0,
    scaleY: 0.3,
  })

  const basedistanceLeft = (this.selected[0].realId) * this.distance + 50
  const basedistanceRigt = (this.selected[1].realId) * this.distance + 50

  line.lineStyle(8, '#a7e049')
    .quadraticCurveTo(0, basedistanceLeft, 300, basedistanceRigt)
    .endFill().addTo(this)

  // 存储数据
  this.setLeft.push(this.selected[0].realId)

  this.setRight.push(this.selected[1].realId)

  this.selected = []

  Hilo.Tween.to(
    line,
    { scaleX: 1, scaleY: 1 },
    {
      duration: 200
    }
  )
}

countdown(){
  // 倒计时动画
  // this.on(Hilo.event.POINTER_START, (e) => {
  //   Hilo.Tween.to(
  //     countdown,
  //     { realTime: properties.initTime },
  //     {
  //       duration: properties.initTime * 1000,

  //       onUpdate () {
  //         const num = parseInt(countdown.realTime)

  //         if (countdown.realTime <= properties.initTime) {

  //           let targetTime = properties.initTime - num

  //           let minutes = Math.floor(targetTime / 60)

  //           let seconds = targetTime - minutes * 60

  //           minutes = Number(minutes) < 10 ? `0${minutes}` : minutes

  //           seconds = Number(seconds) < 10 ? `0${seconds}` : seconds

  //           countdown.text = `${minutes}:${seconds}`

  //           countdown.realTime = num
  //         }
  //       },

  //       onComplete: () => {
  //         countdown.alpha = 1
  //         countdown.text = '00:00'
  //         this.onStart && this.onStart()
  //       }
  //     }
  //   )
  // })

  // questionsRight[index] = new Hilo.Graphics({
  //   x: this.rightX,
  //   y: index * this.distance,
  //   scaleX: 1,
  //   scaleY: 1,
  //   width: rect[2],
  //   height: rect[3],
  //   visible: true
  // })
  // const img = new Image()
  // img.src = item.text
  // img.onload = () => {
  //   img.onload = null
  //   questionsRight[index].beginBitmapFill(img, 'no-repeat').drawRoundRect(0, 0, rect[2], rect[3], 5).endFill().addTo(this)
  // }
}

initTimeTranslate() {
  let minutes = Math.floor(this.questions.time / 60)

  let seconds = this.questions.time - minutes * 60

  minutes = Number(minutes) < 10 ? `0${minutes}` : minutes

  seconds = Number(seconds) < 10 ? `0${seconds}` : seconds

  this.timeTranslate = `${minutes}:${seconds}`
}