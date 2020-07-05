import Hilo from 'hilojs'
import Text from './text'
export default class ResultPanel extends Hilo.Container {
  constructor(properties) {
    super(properties)

    this.stage = properties.stage

    this.creatContainer()

    this.isText = (properties.questions.type === 'text')

    this.questionsLength = properties.questions.left.length

    const allNumber = this.isText ? 5 : 4

    const baseDistance = this.isText ? 130 : 170

    this.distance = baseDistance * (allNumber / this.questionsLength)

    this.initQuestion(properties)

    this.setAnswerQuestionsId = properties.answerQuestionsIds

    this.setAnswer = properties.answerRealIds

    this.resultIds = properties.resultIds

    this.errorIcon = properties.images.errorIcon

    // properties.type  'panel' |'resutl' | 'rightResult' 三种类型
    if (properties.type === 'panel') return
    this.resutlLine(properties)

  }
  selected = []
  isText = false
  rightX = 800
  distance = null
  setAnswerQuestionsId = []
  setAnswer = []
  resultIds = []
  rotationDeg = 0
  lineX = null
  lineBase = null
  errorIcon = null
  repeatAnswerIndex = []
  readyLine = {
    isStart: false
  }
  stage = null
  temporaryQuestionsContainer = null
  temporaryLinesContainer = null
  temporarySelected = null
  temporaryLinesMove = null

  questionsLength = 0

  // Math.atan2(1, 1)*180/Math.PI
  creatContainer () {
    this.temporaryLinesContainer = new Hilo.Container({
      x: (1920 - 499 * 2 - 300) / 2,
      y: this.isText ? 320 - (this.questionsLength * 10) : 280 - (this.questionsLength * 10),
    }).addTo(this)

    this.temporaryQuestionsContainer = new Hilo.Container({
      x: (1920 - 499 * 2 - 300) / 2,
      y: this.isText ? 320 - (this.questionsLength * 10) : 280 - (this.questionsLength * 10),
    }).addTo(this)

    this.temporarySelected = new Hilo.Container({
      x: (1920 - 499 * 2 - 300) / 2,
      y: this.isText ? 320 - (this.questionsLength * 10) : 280 - (this.questionsLength * 10),
    }).addTo(this)
    this.temporaryLinesMove = new Hilo.Container({
      x: 0,
      y: 0,
    }).addTo(this)

  }
  commonLine (left, right, image, isTween, type = 'panel', isError = false) {
    // 设置旋转角度
    this.rotationDeg = Math.atan2(right - left, this.lineBase) * 180 / Math.PI

    const rotateContainer = new Hilo.Container({
      id: this.selected[0] && this.selected[0].realId,
      rotation: this.rotationDeg,
      x: this.lineX - 5,
      y: this.isText ? left : left + 10,
    }).addTo(this.temporaryLinesContainer)

    // 设置背景图
    const rectLine = Math.floor(
      Math.sqrt(
        Math.pow(
          Math.abs(left - right), 2) + Math.pow(this.lineBase, 2)))

    const lineScale = new Hilo.Bitmap({
      x: 0,
      y: 0,
      image,
      rect: [0, 0, rectLine, 17],
      visible: true,
      scaleX: isTween ? 0 : 1,
      scaleY: isTween ? 0 : 1,
    }).addTo(rotateContainer)

    if (type === 'result') {
      new Hilo.Bitmap({
        x: rectLine / 2 - 34,
        y: -20,
        image: this.errorIcon,
        rect: [0, 0, 68, 68],
        visible: true,
        scaleX: 1,
        scaleY: 1,
        visible: true,
        alpha: isError ? 1 : 0
      }).addTo(rotateContainer)
    }

    if (isTween) {
      Hilo.Tween.to(
        lineScale,
        { scaleX: 1, scaleY: 1 },
        {
          duration: 200
        }
      )
    }
    return rotateContainer
  }

  line (properties) {
    if (!this.verifyRepeat()) return
    this.temporaryLinesMove.removeAllChildren()
    if (this.repeatAnswerIndex.length) {
      this.repeatAnswerIndex.forEach((item, index) => {

        this.temporaryLinesContainer.removeChildById(this.setAnswer[item - index][0])

        this.setAnswer.splice(item - index, 1)
        this.setAnswerQuestionsId.splice(item - index, 1)
      })
    }

    this.repeatAnswerIndex = []

    const basedistanceLeft = (this.selected[0].realId) * this.distance + 50
    const basedistanceRight = (this.selected[1].realId) * this.distance + 50

    this.commonLine(basedistanceLeft, basedistanceRight, properties.images.rightLine, true)

    // 存储数据
    this.setAnswer.push([this.selected[0].realId, this.selected[1].realId])
    this.setAnswerQuestionsId.push([this.selected[0].questionId, this.selected[1].questionId])
    this.selected = []
    this.readyLine.isStart = false
  }

  resutlLine (properties) {
    this.resultIds.forEach((item, index) => {

      let isError = properties.answerQuestionsIds[index][0] !== properties.answerQuestionsIds[index][1]

      let images

      let basedistanceLeft

      let basedistanceRight

      if (properties.type === 'result') {

        images = isError ? properties.images.errorLine : properties.images.rightLine

        basedistanceLeft = properties.answerRealIds[index][0] * this.distance + 50

        basedistanceRight = properties.answerRealIds[index][1] * this.distance + 50

      } else {

        isError = !properties.answerRealIds.filter(o => o.join('') === item.join('')).length

        images = isError ? properties.images.tipsLine : properties.images.rightLine

        basedistanceLeft = item[0] * this.distance + 50

        basedistanceRight = item[1] * this.distance + 50
      }

      this.commonLine(basedistanceLeft, basedistanceRight, images, false, properties.type, isError)
    })
  }

  initQuestion (properties) {
    // text:[0, 0, 499, 106], image: [0,0,245, 179]

    const rect = this.isText ? [0, 0, 499, 106] : [0, 0, 245, 179]

    const leftX = this.isText ? 0 : 265

    const baseScale = this.isText ? 1 : 0.8

    this.lineX = leftX + rect[2] * baseScale

    this.lineBase = this.isText ? 320 : 360

    let questionsLeftBg = []
    let questionsLeft = []
    let questionsRight = []
    let questionsRightBg = []

    properties.questions.left.forEach((item, index) => {
      questionsLeftBg[index] = new Hilo.Bitmap({
        x: leftX,
        y: index * this.distance,
        image: properties.images.questionLeft,
        rect,
        visible: true,
        scaleX: baseScale,
        scaleY: baseScale,
      }).addTo(this.temporaryQuestionsContainer)

      questionsLeft[index] = new Text({
        id: { realId: index, questionId: item.id },
        text: item.text,
        fontSize: this.isText ? 70 : 35,
        bold: true,
        textAlign: 'center',
        visible: true,
        alpha: 1,
        reTextWidth: rect[2] * baseScale,
        height: rect[3] * baseScale - (this.isText ? 15 : 50),
        x: leftX,
        y: index * this.distance + (this.isText ? 20 : 55),
        color: this.isText ? '#fff' : '#d6b355',
      }).addTo(this.temporaryQuestionsContainer)

      this.panelClick('left',
        questionsLeft[index],
        questionsLeftBg[index],
        properties,
        leftX,
        index * this.distance,
        baseScale, this.isText ? 1.05 : .9,
        rect)
    })

    properties.questions.right.forEach((item, index) => {
      questionsRightBg[index] = new Hilo.Bitmap({
        x: this.rightX,
        y: index * this.distance,
        image: properties.images.questionRight,
        rect,
        visible: true,
        scaleX: baseScale,
        scaleY: baseScale,
      }).addTo(this.temporaryQuestionsContainer)

      if (this.isText) {
        questionsRight[index] = new Text({
          id: { realId: index, questionId: item.id },
          text: item.text,
          fontSize: 70,
          lineHeight: rect[3] * baseScale,
          bold: true,
          textAlign: 'center',
          reTextWidth: rect[2] * baseScale,
          height: rect[3] * baseScale - 15,
          visible: true,
          alpha: 1,
          x: this.rightX,
          y: index * this.distance + 20,
          color: '#ffffff',
        }).addTo(this.temporaryQuestionsContainer)
      } else {
        const imageScaleBaese = 0.15
        // const imageScale = baseScale - imageScaleBaese
        const imageX = Math.round(imageScaleBaese * rect[2])
        const imageY = Math.round(imageScaleBaese * rect[3])
        questionsRight[index] = new Hilo.Container({
          id: { realId: index, questionId: item.id },
          x: this.rightX + imageX / 2,
          y: index * this.distance + imageY / 2,
          width: rect[2],
          height: rect[3],
          visible: true,
          scaleX: 1,
          scaleY: 1,
        }).addTo(this.temporaryQuestionsContainer)

        // 渲染图片
        const img = new Image()
        img.src = item.text
        img.onload = (e) => {
          const realImageWidth = e.path[0].width
          const realImageHeight = e.path[0].height
          const scale = realImageWidth > realImageHeight ? (rect[2] - 40) * baseScale / realImageWidth : (rect[3] - 35) * baseScale / realImageHeight
          new Hilo.Bitmap({
            id: { realId: index, questionId: item.id },
            x: realImageWidth > realImageHeight ? 0 : (rect[2] - 80 - realImageWidth * scale) / 2,
            y: realImageWidth > realImageHeight ? (rect[3] - 60 - realImageHeight * scale) / 2 : 0,
            width: realImageWidth * scale,
            height: realImageHeight * scale,
            image: item.text,
            visible: true,
          }).addTo(questionsRight[index])
        }
      }

      this.panelClick('right',
        questionsRight[index],
        questionsRightBg[index],
        properties,
        this.rightX,
        index * this.distance,
        baseScale,
        this.isText ? 1.05 : .9,
        rect)
    })

    this.stage.on(Hilo.event.POINTER_MOVE, (e) => {
      if (!this.readyLine.isStart) return
      // 正则表达式 RegExp(/left/).test(str)
      if (this.temporaryLinesMove.getNumChildren() > 0) {
        this.temporaryLinesMove.removeChildAt(0)
      }
      let line = new Hilo.Graphics({
        x: 0,
        y: 0,
        visible: true,
      }).addTo(this.temporaryLinesMove)
      line.beginPath()
        .moveTo(e.stageX, e.stageY)
        .lineStyle(8, '#a7e049')
        .lineTo(this.readyLine.x, this.readyLine.y)
        .endFill()
        .addTo(this.temporaryLinesMove)
    })
  }

  panelClick (type, eventTarget, target,
    properties, initX, initY, baseScale,
    targetScale, rect) {
    eventTarget.on(Hilo.event.POINTER_START, (e) => {
      this.readyLine = {
        isStart: true,
        x: e.stageX,
        y: e.stageY
      }
      if (type === 'right' && !this.selected.length) this.selected[0] = null
      this.selected[type === 'left' ? 0 : 1] = e.eventTarget.id

      if (this.temporarySelected.getNumChildren() > 0) {
        this.temporarySelected.removeChildAt(0)
      }
      let selectedCanvas = new Hilo.Graphics({
        x: initX,
        y: initY,
        visible: false
      }).addTo(this.temporarySelected)

      selectedCanvas.lineStyle(4, "#ff2a2a").drawRoundRect(0, 0, rect[2] * baseScale, rect[3] * baseScale, 20).endFill()

      Hilo.Tween.to(
        target,
        {
          scaleX: targetScale, scaleY: targetScale,
          x: initX - (rect[2] * 0.05) / 2 - (this.isText ? 0 : 8),
          y: initY - (rect[3] * 0.05) / 2 - (this.isText ? 0 : 8)
        },
        {
          duration: 100,
          onComplete () {
            // this.temporarySelected.removeChild()
            Hilo.Tween.to(
              target,
              { scaleX: baseScale, scaleY: baseScale, x: initX, y: initY },
              {
                duration: 300,
                onComplete () {
                  selectedCanvas.visible = true
                }
              }
            )
          }
        }
      )
      if (properties.type !== 'panel') return
      this.line(properties)
    })
  }

  verifyRepeat () {
    // 验证是否选中两个
    if (!(this.selected.length === 2
      && this.selected.every(item => item))) return false

    this.setAnswer.forEach((item, index) => {
      if ((item[0] === this.selected[0].realId) || (item[1] === this.selected[1].realId)) {
        this.repeatAnswerIndex.push(index)
      }
    })

    return true
  }

}
