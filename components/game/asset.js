import Hilo from 'hilojs'

export default function () {

  return Hilo.Class.create({
    Mixes: Hilo.EventMixin,
    queue: null,
    bg: null,
    errorIcon: null,
    rightIcon: null,
    titleBg: null,
    submitButton: null,
    errorModel: null,
    rightModel: null,
    rightBtn: null,
    resetBtn: null,
    chooseIcon: null,
    bgIcon: null,
    fillIcon: null,

    async load () {
      const resources = [
        { id: 'bg', src: require('~/static/bg.png') },
        { id: 'errorIcon', src: require('~/static/error_icon.png') },
        { id: 'rightIcon', src: require('~/static/right_icon.png') },
        { id: 'titleBg', src: require('~/static/title.png') },
        { id: 'submit', src: require('~/static/submit.png') },
        { id: 'errorModel', src: require('~/static/answer_error.png') },
        { id: 'rightModel', src: require('~/static/answer.png') },
        { id: 'rightBtn', src: require('~/static/answer_button.png') },
        { id: 'resetBtn', src: require('~/static/align_button.png') },
        { id: 'chooseIcon', src: require('~/static/choose_button.png') },
        { id: 'bgIcon', src: require('~/static/bg_button.png') },
        { id: 'fillIcon', src: require('~/static/button.png') }
      ]
      this.queue = new Hilo.LoadQueue()
      this.queue.add(resources)
      this.queue.on('load', this.onProcess.bind(this))
      return await new Promise((resolve, reject) => {
        this.queue.on('complete', (e) => {
          this.onComplete(e)
          resolve(this)
        })
        this.queue.on('error', (e) => {
          this.onError(e)
          reject(e)
        })
        this.queue.start()
      })
    },
    onProcess (e) {
      this.fire('load', e)
    },
    onError (e) {
      this.fire('error', e)
    },
    onComplete (e) {
      this.bg = this.queue.get('bg').content
      this.errorIcon = this.queue.get('errorIcon').content
      this.rightIcon = this.queue.get('rightIcon').content
      this.titleBg = this.queue.get('titleBg').content
      this.submitButton = this.queue.get('submit').content
      this.rightModel = this.queue.get('rightModel').content
      this.errorModel = this.queue.get("errorModel").content
      this.rightBtn = this.queue.get("rightBtn").content
      this.resetBtn = this.queue.get("resetBtn").content
      this.chooseIcon = this.queue.get("chooseIcon").content
      this.bgIcon = this.queue.get("bgIcon").content
      this.fillIcon = this.queue.get("fillIcon").content

      this.queue.off('complete')
      this.fire('complete')
    },
  })
}
