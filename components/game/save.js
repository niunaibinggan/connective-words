import AssetsFectory from '~/components/game/asset'
import StageFectory from '~/components/game/stage'
import ExportScence from '~/components/game/exportScence'

export default async function init (questions) {
  // const  // 接入hilo动画引擎
  const Assets = AssetsFectory()

  const assets = new Assets()
  await assets.load()

  // 初始化舞台
  const gameMain = StageFectory()

  const { stage, ticker } = gameMain

  const { bg, titleBg } = assets

  // 准备场景
  const exportScence = new ExportScence({
    x: 0,
    y: 0,
    questions,
    images: { bg, titleBg },
    title: questions.title,
  })

  stage.addChild(exportScence)

  return new Promise((re) => {
    ticker.nextTick(() => {
      re(stage.canvas.toDataURL('image/png'))
    })
  })
}
