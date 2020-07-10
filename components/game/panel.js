import Hilo from 'hilojs'
import Text from './text'
export default class ResultPanel extends Hilo.Container {
  constructor(properties) {
    super(properties)

    this.stage = properties.stage

    this.questions = properties.questions

    if (properties.type === 'panel') this.setAnswer = Array.apply(null, { length: properties.questions.length })
    else this.setAnswer = properties.setAnswer

    this.answerError = properties.answerError
    this.rightIcon = properties.rightIcon

    // properties.type  'panel' |'resutl' 两种种类型
    this.panelType = properties.type

    this.errorIcon = properties.errorIcon

    this.creatContainer()

    this.initBlock(properties)

  }
  questions = []
  answerError = []
  rect = [0, 0, 200, 86]
  bgIcon = require('~/static/bg_button.png')
  chooseIcon = require('~/static/choose_button.png')
  fillIcon = require('~/static/button.png')
  errorIcon = ''
  rightIcon = ''
  stage = null
  temporaryQuestionsContainer = null
  temporarySelectedContainer = null

  setAnswer = []
  includeArr = []
  panelType = ''
  questionDistanceBase = 5
  selectedDistanceBase = 110
  questionTargetNumber = 0
  selectedTargetNumber = 0
  questionsOffsetValue = {}
  selectedOffsetValue = {}


  creatContainer () {
    this.temporaryQuestionsContainer = new Hilo.Container({
      id: 'questions',
      x: 220,
      y: 320,
    }).addTo(this)

    this.temporarySelectedContainer = new Hilo.Container({
      id: 'select',
      x: 220,
      y: 660,
    }).addTo(this)
  }

  initBlock (properties) {
    properties.questions.forEach((item, index) => {

      this.questionsOffsetValue = this.getOffsetValue({
        type: 'questions',
        index,
        base: this.questionDistanceBase
      })

      let answerText
      if (this.panelType === 'result') {
        answerText = properties.questions.filter(item => this.setAnswer[index].questionId === item.id)[0].text
      }


      this.commonBlock({
        target: this.temporaryQuestionsContainer,
        image: this.panelType === 'panel' ? this.bgIcon : this.fillIcon,
        id: this.panelType === 'result' ? this.setAnswer[index].questionId : item.id,
        text: this.panelType === 'result' ? answerText : item.text,
        index,
        type: this.panelType,
        textVisible: this.panelType !== 'panel',
        offsetValue: this.questionsOffsetValue,
        isAllow: false
      })

      if (this.panelType === 'panel') {

        this.selectedOffsetValue = this.getOffsetValue({
          type: 'selected',
          index,
          base: this.selectedDistanceBase
        })

        this.commonBlock({
          target: this.temporarySelectedContainer,
          image: this.chooseIcon,
          id: item.id,
          text: item.text,
          index,
          type: this.panelType,
          textVisible: this.panelType === 'panel',
          offsetValue: this.selectedOffsetValue,
          isAllow: true
        })
      }
    })
  }
  commonBlock (data) {

    const id = { realId: data.index, questionId: data.id }

    const blockCon = this.creatBlockContainer(data.target, data.image, id, data.offsetValue.x, data.offsetValue.y)

    if (data.type === 'result') this.creatError(blockCon, data.index)

    if (data.textVisible) this.creatText(blockCon, data.text, id)

    if (data.type === 'panel' && data.isAllow) this.drag(blockCon)
  }
  drag (blockCon) {
    Hilo.util.copy(blockCon, Hilo.drag)
    blockCon.startDrag([-220, -660, 1920, 1080])

    let targetEvent = null

    let startDragRealId

    blockCon.on("dragStart", (e) => {
      this.includeArr = []
      e.target.getChildAt(0).alpha = 1
      targetEvent = e
      startDragRealId = this.findeQuestionsIndex(e.target.id.questionId)
    })

    blockCon.on("dragMove", (event) => {

      this.onloadImage(this.chooseIcon, event.target.getChildAt(0), this)

      event.target.getChildAt(0).alpha = 1

      this.includeArr = this.findBlockIndex(event.target.x, event.target.y, 'arr')

      this.setAnswer.forEach((item, index) => {
        if (item && !this.includeArr.includes(startDragRealId)) {
          this.temporarySelectedContainer.getChildAt(item.realId).alpha = this.includeArr.includes(index) ? 0 : .9
        }
      })
    })
    const that = this

    blockCon.on("dragEnd", (event) => {
      this.temporarySelectedContainer.children.map(item => item.alpha = .9)
      const currentTarget = this.findBlockIndex(event.target.x, event.target.y, 'index')

      const isSelected = currentTarget !== -1

      const id = event.target.id.realId

      const start = this.getSelectedOffsetValue({
        index: id,
        base: this.selectedDistanceBase
      })
      let x = start.x
      let y = start.y
      const selectedId = this.findeQuestionsIndex(event.target.id.questionId)

      if (isSelected) {
        x = this.temporaryQuestionsContainer.getChildAt(currentTarget).x
        y = this.temporaryQuestionsContainer.getChildAt(currentTarget).y - 340

        if (selectedId !== -1) this.setAnswer[selectedId] = undefined
      }
      if (!isSelected && selectedId !== -1) {
        this.setAnswer[selectedId] = undefined
      }

      if (this.setAnswer[currentTarget] && selectedId !== currentTarget) {

        const id = this.setAnswer[currentTarget].realId

        const start = this.getSelectedOffsetValue({
          index: id,
          base: this.selectedDistanceBase
        })

        this.temporarySelectedContainer.getChildAt(id).x = start.x
        this.temporarySelectedContainer.getChildAt(id).y = start.y

        this.onloadImage(this.chooseIcon, this.temporarySelectedContainer.getChildAt(id).getChildAt(0), this)
      }

      Hilo.Tween.to(
        blockCon,
        { x, y },
        {
          duration: 150,
          onComplete () {
            if (isSelected) {
              // 更换 button 背景
              that.onloadImage(that.fillIcon, targetEvent.target.getChildAt(0), that)

              that.setAnswer[currentTarget] = {
                questionId: targetEvent.target.id.questionId,
                realId: targetEvent.target.id.realId,
                moveId: currentTarget
              }
            }
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
      const pattern = _this.stage.renderer.context.createPattern(img, 'no-repeat')
      target.background = pattern
    }
  }

  findBlockIndex (dragX, dragY, type) {
    const distanceFlagX = this.rect[2] + 5
    const distanceFlagY = 86

    // 获取所有 block 的位置
    const arr = this.temporarySelectedContainer.children.map((item, index) => {
      return {
        x: index < this.questionTargetNumber ? index * distanceFlagX : (index - this.questionTargetNumber) * distanceFlagX,
        y: !this.questionTargetNumber || index < this.questionTargetNumber ? -340 : -340 + distanceFlagY,
      }
    })

    // 过滤出相近的 block 的位置
    const filterArr = arr.filter((item, index) => {
      const x = Math.round(Math.abs(item.x - dragX))
      const y = Math.round(Math.abs(item.y - dragY))

      if ((item.x + distanceFlagX > dragX) && (item.x - distanceFlagX < dragX)
        && (item.y - distanceFlagY < dragY) && (item.y + distanceFlagY > dragY) && x < 200) {
        item.index = index
        item.distanceX = x
        item.distanceY = y
        return item
      }
    })

    if (!filterArr.length) return type === 'arr' ? [] : -1

    if (type === 'arr') {
      // this.temporarySelectedContainer.children.map(item => item.alpha = .9)
      return filterArr.map(item => item && item.index)
    }

    let MaxDistance = null


    if (filterArr.length === 2) {

      if (filterArr[0].distanceY === filterArr[1].distanceY) MaxDistance = Math.min(...filterArr.map(item => item.distanceX))

      else MaxDistance = Math.min(...filterArr.map(item => item.distanceY))

    } else {
      MaxDistance = Math.min(...filterArr.map(item => item.distanceX).concat(filterArr.map(item => item.distanceY)))
    }

    return filterArr[filterArr.findIndex(item => (item.distanceX === MaxDistance || item.distanceY === MaxDistance))].index

  }

  getOffsetValue (data) {
    const isLineBreak = (1920 - 220 * 2) - (this.rect[2] + data.base) * data.index < 220

    let targetNumber = data.type === 'questions' ? this.questionTargetNumber : this.selectedTargetNumber

    if (!targetNumber && isLineBreak) data.type === 'questions' ? this.questionTargetNumber = data.index : this.selectedTargetNumber = data.index

    const number = data.type === 'questions' ? this.questionTargetNumber : this.selectedTargetNumber

    const initX = (this.rect[2] + data.base) * Math.abs(data.index - number)
    const initY = isLineBreak ? this.rect[3] + 20 : 0

    return { x: initX, y: initY }
  }

  getSelectedOffsetValue (data) {
    const current = this.selectedTargetNumber && (data.index >= this.selectedTargetNumber) ? data.index - this.selectedTargetNumber : data.index
    const initX = (this.rect[2] + data.base) * current
    const initY = this.selectedTargetNumber && (data.index >= this.selectedTargetNumber) ? this.rect[3] + 20 : 0

    return { x: initX, y: initY }
  }

  creatBlockContainer (target, image, id, x, y) {
    const blockCon = new Hilo.Container({
      id,
      x,
      y,
    }).addTo(target)

    const creatView = new Hilo.View({
      id,
      width: this.rect[2],
      height: this.rect[3]
    }).addTo(blockCon)

    this.onloadImage(image, creatView, this)
    return blockCon
  }
  creatText (blockCon, text, id) {
    new Text({
      id,
      text,
      fontSize: text.length < 4 ? 34 : 34 - Math.round(text.length / 3) * 5,
      bold: true,
      textAlign: 'center',
      visible: true,
      alpha: 1,
      reTextWidth: this.rect[2],
      height: this.rect[3] - 27,
      x: 0,
      y: Math.floor(text.length / 5) ? 27 + (34 - (34 - Math.round(text.length / 3) * 5)) / 2 : 27,
      color: '#fff',
    }).addTo(blockCon)
  }

  creatError (blockCon, index) {
    let alpha = null
    if (this.answerError.length) {
      alpha = this.answerError.findIndex(item => item.moveId === index) !== -1 ? 1 : 0
    } else {
      alpha = this.setAnswer.length - 1 === index ? 1 : 0
    }
    new Hilo.Bitmap({
      image: this.answerError.length ? this.errorIcon : this.rightIcon,
      rect: this.answerError.length ? [0, 0, 44, 44] : [0, 0, 48, 44],
      visible: true,
      scaleX: 1,
      scaleY: 1,
      x: this.answerError.length ? 162 : 172,
      y: 56,
      alpha,
    }).addTo(blockCon)
  }

  findeQuestionsIndex (id) {
    return this.setAnswer.findIndex(item => item && (item.questionId === id))
  }
}
