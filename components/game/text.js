import Hilo from 'hilojs'
export default class GameText extends Hilo.Text {
  constructor(properties) {
    const {
      reTextWidth = 750,
      fixIOS = false,
      fontSize = 12,
      lineHeight = 12,
      bold = false
    } = properties

    const fixIOSScale = (fontSize) => {
      return fixIOS && fontSize < 40 ? (1 / 40) * fontSize : 1
    }

    properties.font = `normal ${
      bold ? 'bold' : '400'
      } ${fontSize}px/${lineHeight /
      fixIOSScale(
        fontSize
      )}px Myriad Pro, Helvetica Neue, Helvetica, Arial, Microsoft Yahei,Hiragino Sans GB, Heiti SC, WenQuanYi Micro Hei, sans-serif`

    properties.scaleX = properties.scaleY = fixIOSScale(fontSize)
    properties.maxWidth = reTextWidth / fixIOSScale(fontSize)
    properties.width = reTextWidth / fixIOSScale(fontSize)
    if (properties.textOverflow) {
      properties.text = this.textOverWidth(
        properties.font,
        properties.text || '',
        properties.reTextWidth - properties.fontSize
      )
    }
    super(properties)
  }
}
