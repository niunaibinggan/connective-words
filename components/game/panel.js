import Hilo from 'hilojs'
import Text from './text'
export default class ResultPanel extends Hilo.Container {
  constructor(properties) {
    super(properties)
    this.stage = properties.stage

    this.creatContainer()

    this.initBlock(properties)

    this.setAnswerQuestionsId = properties.answerQuestionsIds

    // this.setAnswer = properties.answerRealIds

    // this.resultIds = properties.resultIds

    // this.errorIcon = properties.images.errorIcon

    // properties.type  'panel' |'resutl' | 'rightResult' 三种类型
    if (properties.type === 'panel') return
    // this.resutlLine(properties)

  }
  // selected = []
  // isText = false
  // rightX = 800
  // distance = null
  setAnswerQuestionsId = []
  rect = [0, 0, 200, 86]
  targetNumber = 0
  statPosition = {}
  bgIcon = require('~/static/bg_button.png')
  chooseIcon = require('~/static/choose_button.png')
  fillIcon = require('~/static/button.png')
  // setAnswer = []
  // resultIds = []
  // rotationDeg = 0
  // lineX = null
  // lineBase = null
  // errorIcon = null
  // repeatAnswerIndex = []
  // readyLine = {
  //   isStart: false
  // }
  stage = null
  temporaryQuestionsContainer = null
  temporarySelectedContainer = null


  creatContainer () {
    this.temporaryQuestionsContainer = new Hilo.Container({
      x: 220,
      y: 320,
    }).addTo(this)

    this.temporarySelectedContainer = new Hilo.Container({
      x: 220,
      y: 660,
    }).addTo(this)
  }

  initBlock (properties) {
    properties.questions.forEach((item, index) => {
      this.commonBlock(this.temporaryQuestionsContainer, this.bgIcon, item, index, false)
      this.commonBlock(this.temporarySelectedContainer, this.chooseIcon, item, index, true)
    })
  }
  commonBlock (target, image, item, index, textVisible) {
    const isLineBreak = (1920 - 220 * 2) - (this.rect[2] + 5) * index < 220

    if (!this.targetNumber && isLineBreak) this.targetNumber = index

    const initX = (this.rect[2] + 5) * (index - this.targetNumber)
    const initY = isLineBreak ? this.rect[3] + 20 : 0

    const blockCon = new Hilo.Container({
      id: { realId: index, questionId: item.id },
      x: initX,
      y: initY,
    }).addTo(target)

    // new Hilo.Bitmap({
    //   id: { realId: index, questionId: item.id },
    //   image,
    //   rect: this.rect,
    //   visible: true,
    //   scaleX: 1,
    //   scaleY: 1,
    //   alpha: textVisible ? 0.9 : 1
    // }).addTo(blockCon)

    const creatView = new Hilo.View({
      id: { realId: index, questionId: item.id },
      width: this.rect[2],
      height: this.rect[3]
    }).addTo(blockCon)

    this.onloadImage(image, creatView, this)

    if (textVisible) {
      new Text({
        id: { realId: index, questionId: item.id },
        text: item.text,
        fontSize: 34,
        bold: true,
        textAlign: 'center',
        visible: true,
        alpha: 1,
        reTextWidth: this.rect[2],
        height: this.rect[3] - 27,
        x: 0,
        y: 27,
        color: '#fff',
      }).addTo(blockCon)

      this.drag(blockCon)
    }
  }
  drag (blockCon) {
    Hilo.util.copy(blockCon, Hilo.drag)
    blockCon.startDrag([-220, -660, 1920, 1080])

    let targetEvent = null

    blockCon.on("dragStart", (e) => {
      this.statPosition = {
        x: e.target.x,
        y: e.target.y
      }

      this.onloadImage(this.chooseIcon, e.target.getChildAt(0), this)

      e.target.getChildAt(0).alpha = 1
      targetEvent = e
    })

    const that = this

    blockCon.on("dragEnd", (event) => {
      const endX = event.detail.x - 71
      let current = Math.round(endX / (this.rect[2] + 5) - 1)
      if (current <= -1) current = Math.ceil(endX / (this.rect[2] + 5) - 1)
      console.log(event.detail.x)
      console.log(current)
      console.log(this.temporaryQuestionsContainer.getChildAt(0))
      console.log((this.rect[2] + 5) * 2)
      const isSelected = true
      const x = isSelected ? this.temporaryQuestionsContainer.getChildAt(0).x : this.statPosition.x
      const y = isSelected ? this.temporaryQuestionsContainer.getChildAt(0).y - 340 : this.statPosition.y
      Hilo.Tween.to(
        blockCon,
        { x, y },
        {
          duration: 200,
          onComplete () {
            that.onloadImage(that.fillIcon, targetEvent.target.getChildAt(0), that)
            targetEvent.target.getChildAt(0).alpha = .9
          }
        }
      )
    })
  }

  onloadImage (image, target, _this) {
    const img = new Image()
    img.src = image
    img.onload = () => {
      img.onload = null
      const pattern = _this.stage.renderer.context.createPattern(img, 'no-repeat');
      target.background = pattern;
    }
  }
}

