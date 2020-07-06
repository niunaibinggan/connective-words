import Hilo from 'hilojs'
import Text from './text'
export default class ResultPanel extends Hilo.Container {
  constructor(properties) {
    super(properties)

    this.stage = properties.stage

    this.questions = properties.questions

    // 生成答题数组
    this.setAnswer = Array.apply(null, { length: properties.questions.length })

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
  questions = []
  setAnswerQuestionsId = []
  rect = [0, 0, 200, 86]
  targetNumber = 0
  startPosition = {}
  bgIcon = require('~/static/bg_button.png')
  chooseIcon = require('~/static/choose_button.png')
  fillIcon = require('~/static/button.png')
  stage = null
  temporaryQuestionsContainer = null
  temporarySelectedContainer = null

  setAnswer = []


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
    console.log(this.setAnswer.length)
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
      this.startPosition = {
        x: e.target.x,
        y: e.target.y
      }
      e.target.getChildAt(0).alpha = 1
      targetEvent = e
    })

    blockCon.on("dragMove", (e) => {
      this.onloadImage(this.chooseIcon, e.target.getChildAt(0), this)
      e.target.getChildAt(0).alpha = 1
    })

    const that = this

    blockCon.on("dragEnd", (event) => {
      const currentTarget = this.findBlockIndex(event.target.x, event.target.y)

      const isSelected = currentTarget !== -1

      const x = isSelected ? this.temporaryQuestionsContainer.getChildAt(currentTarget).x : this.startPosition.x
      const y = isSelected ? this.temporaryQuestionsContainer.getChildAt(currentTarget).y - 340 : this.startPosition.y
      Hilo.Tween.to(
        blockCon,
        { x, y },
        {
          duration: 100,
          onComplete () {
            if (isSelected) {
              that.onloadImage(that.fillIcon, targetEvent.target.getChildAt(0), that)
              that.setAnswer[currentTarget] = targetEvent.target.id.questionId

              console.log(that.setAnswer)
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

  findBlockIndex (dragX, dragY) {
    const distanceFlagX = 205
    const distanceFlagY = 86

    // 获取所有 block 的位置
    const arr = this.temporarySelectedContainer.children.map((item, index) => {
      return {
        x: index < this.targetNumber ? index * distanceFlagX : (index - this.targetNumber) * distanceFlagX,
        y: index < this.targetNumber ? -340 : -340 + distanceFlagY
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

    if (!filterArr.length) return -1

    let MaxDistance = null

    if (filterArr.length == 2) {

      if (filterArr[0].distanceX === filterArr[1].distanceX) MaxDistance = Math.min(...filterArr.map(item => item.distanceY))

      else MaxDistance = Math.min(...filterArr.map(item => item.distanceX))

    } else {
      MaxDistance = Math.min(...filterArr.map(item => item.distanceX).concat(filterArr.map(item => item.distanceY)))
    }

    return filterArr[filterArr.findIndex(item => (item.distanceX === MaxDistance || item.distanceY === MaxDistance))].index

  }
}

