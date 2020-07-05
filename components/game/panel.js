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

  // questionsLength = 0

  creatContainer () {
    this.temporaryQuestionsContainer = new Hilo.Container({
      x: 260,
      y: 320,
    }).addTo(this)

    this.temporarySelectedContainer = new Hilo.Container({
      x: 260,
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
    const isLineBreak = (1920 - 260 * 2) - (this.rect[2] + 20) * index < 260

    if (!this.targetNumber && isLineBreak) {
      this.targetNumber = index
    }
    new Hilo.Bitmap({
      id: { realId: index, questionId: item.id },
      x: (this.rect[2] + 20) * (index - this.targetNumber),
      y: isLineBreak ? this.rect[3] + 40 : 0,
      image,
      rect: this.rect,
      visible: true,
      scaleX: 1,
      scaleY: 1,
    }).addTo(target)

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
        x: (this.rect[2] + 20) * (index - this.targetNumber),
        y: isLineBreak ? this.rect[3] + 67 : 27,
        color: '#fff',
      }).addTo(target)
    }
  }

}

