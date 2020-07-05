import Hilo from 'hilojs'
import Text from './text'
export default class ResultPanel extends Hilo.Container {
  constructor(properties) {
    super(properties)
    this.stage = properties.stage

    this.fillIcon = properties.images.fillIcon

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
  fillIcon = null
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
      this.commonBlock(this.temporaryQuestionsContainer, properties.images.bgIcon, item, index, false)
      this.commonBlock(this.temporarySelectedContainer, properties.images.chooseIcon, item, index, true)
    })
  }
  commonBlock (target, image, item, index, textVisible) {
    const isLineBreak = (1920 - 220 * 2) - (this.rect[2] + 5) * index < 220

    if (!this.targetNumber && isLineBreak) this.targetNumber = index

    const blockCon = new Hilo.Container({
      id: { realId: index, questionId: item.id },
      x: (this.rect[2] + 5) * (index - this.targetNumber),
      y: isLineBreak ? this.rect[3] + 20 : 0,
    }).addTo(target)

    new Hilo.Bitmap({
      id: { realId: index, questionId: item.id },
      image,
      rect: this.rect,
      visible: true,
      scaleX: 1,
      scaleY: 1,
      alpha: textVisible ? 0.9 : 1
    }).addTo(blockCon)

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
      e.target.getChildAt(0).alpha = 1
      targetEvent = e
    })

    const that = this

    blockCon.on("dragEnd", (event) => {
      const isSelected = true
      const x = isSelected ? this.temporaryQuestionsContainer.getChildAt(0).x : this.statPosition.x
      const y = isSelected ? this.temporaryQuestionsContainer.getChildAt(0).y - 340 : this.statPosition.y
      Hilo.Tween.to(
        blockCon,
        { x, y },
        {
          duration: 200,
          onComplete () {
            console.log(targetEvent.target.getChildAt(0).image)
            targetEvent.target.getChildAt(0).alpha = .9
            targetEvent.target.getChildAt(0).image = that.fillIcon
          }
        }
      )
    })
  }
}

