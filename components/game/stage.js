import Hilo from 'hilojs'
export default function initStage () {
  let stage = null
  let ticker = null

  let gameWidth = 1920 // Math.min(1920, innerWidth) //1920
  let gameHeight = 1080 // gameWidth / (1920 / 1920) //1920
  let scaleX = innerWidth / 1920
  let scaleY = innerHeight / 1080

  stage = new Hilo.Stage({
    renderType: 'canvas',
    width: gameWidth,
    height: gameHeight,
    // background: 'rgba(255, 187, 57, 1)',
    scaleX: scaleX,
    scaleY: scaleY,
    container: document.createElement('canvas')
  })
  //绑定交互事件
  stage.enableDOMEvent(Hilo.event.POINTER_START, true)
  stage.enableDOMEvent(Hilo.event.POINTER_MOVE, true)
  stage.enableDOMEvent(Hilo.event.POINTER_END, true)
  window.addEventListener('resize', () => {
    requestAnimationFrame(() => {
      stage.scaleX = innerWidth / 1920
      stage.scaleY = innerHeight / 1080
      stage.updateViewport()
    })
  })
  //启动计时器
  ticker = new Hilo.Ticker(60)
  ticker.addTick(Hilo.Tween)
  ticker.addTick(stage)
  ticker.start(true)
  stage.ticker = ticker

  return { stage, ticker }
}
