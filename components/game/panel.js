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

    blockCon.on("dragStart", (e) => {
      e.target.getChildAt(0).alpha = 1
      targetEvent = e
    })

    blockCon.on("dragMove", (event) => {

      this.onloadImage(this.chooseIcon, event.target.getChildAt(0), this)

      event.target.getChildAt(0).alpha = 1

      this.includeArr = this.findBlockIndex(event.target.x, event.target.y, 'arr')

      // this.setAnswer.forEach(item => {
      //   if (item) {
      //     this.temporarySelectedContainer.getChildAt(item.realId).alpha = this.includeArr.includes(item.realId) ? 0 : 1
      //   }
      // })
    })

    const that = this

    blockCon.on("dragEnd", (event) => {
      // this.includeArr = []
      // this.temporarySelectedContainer.children.map(item => item.alpha = 1)
      const currentTarget = this.findBlockIndex(event.target.x, event.target.y, 'index')

      console.log(currentTarget)

      const isSelected = currentTarget !== -1

      const id = event.target.id.realId

      const start = this.getSelectedOffsetValue({
        index: id,
        base: this.selectedDistanceBase
      })
      let x = start.x
      let y = start.y

      if (isSelected) {
        x = this.temporaryQuestionsContainer.getChildAt(currentTarget).x
        y = this.temporaryQuestionsContainer.getChildAt(currentTarget).y - 340

        const a = this.getSelectedOffsetValue({
          index: currentTarget,
          base: this.questionDistanceBase
        })
      } else {
        this.setAnswer[id] = undefined
      }
      Hilo.Tween.to(
        blockCon,
        { x, y },
        {
          duration: 100,
          onComplete () {
            if (isSelected) {
              // 更换 button 背景
              that.onloadImage(that.fillIcon, targetEvent.target.getChildAt(0), that)

              if (that.setAnswer[currentTarget]) {
                const id = that.setAnswer[currentTarget].realId

                const start = that.getSelectedOffsetValue({
                  index: id,
                  base: that.selectedDistanceBase
                })
                that.temporarySelectedContainer.getChildAt(id).x = start.x
                that.temporarySelectedContainer.getChildAt(id).y = start.y
                that.onloadImage(that.chooseIcon, that.temporarySelectedContainer.getChildAt(id).getChildAt(0), that)
              }

              that.setAnswer[currentTarget] = {
                questionId: targetEvent.target.id.questionId,
                realId: targetEvent.target.id.realId
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
    const distanceFlagX = 205
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
      if ((item.x > dragX - distanceFlagX) && (item.x < dragX + distanceFlagX)
        && (item.y > dragY - distanceFlagY) && (item.y < dragY + distanceFlagY)) {
        item.index = index
        item.distanceX = Math.round(Math.abs(item.x - dragX))
        item.distanceY = Math.round(Math.abs(item.y - dragY))
        return item
      }
    })

    if (!filterArr.length) return type === 'arr' ? [] : -1

    if (type === 'arr') {
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
    const current = this.selectedTargetNumber && (data.index > this.selectedTargetNumber) ? data.index - this.selectedTargetNumber : data.index
    const initX = (this.rect[2] + data.base) * current
    const initY = this.selectedTargetNumber && (data.index > this.selectedTargetNumber) ? this.rect[3] + 20 : 0

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
  }

  creatError (blockCon, index) {
    new Hilo.Bitmap({
      image: this.errorIcon,
      rect: [0, 0, 44, 44],
      visible: true,
      scaleX: 1,
      scaleY: 1,
      x: 162,
      y: 56,
      alpha: this.setAnswer[index].questionId !== index ? 1 : 0
    }).addTo(blockCon)
  }
}
