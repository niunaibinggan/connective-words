import Hilo from 'hilojs'
import Text from './text'
export default class ResultPanel extends Hilo.Container {
  constructor(properties) {
    super(properties)

    this.leftQuestion = properties.questions.concat

    // this.stage = properties.stage

    this.creatContainer()
  }

  leftQuestion = null
  leftContainer = null
  rightContainer = null

  creatContainer () {
    this.leftContainer = new Hilo.Container({
      x: 0,
      y: 0,
    }).addTo(this)

    this.rightContainer = new Hilo.Container({
      x: 0,
      y: 0,
    }).addTo(this)
  }
}
