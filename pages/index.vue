<template>
  <div class="container"
       ref="container"></div>

</template>

<script>
  import Hilo from 'hilojs'
  import AssetsFectory from '~/components/game/asset'
  import StageFectory from '~/components/game/stage'
  import ExportScence from '~/components/game/exportScence'
  import SubmitButton from '~/components/game/submitButton'
  import Panel from '~/components/game/panel'
  // import ResultModel from '~/components/game/resultModel'
  // import ResetButton from '~/components/game/resetButton'
  // import Text from '~/components/game/text'
  export default {
    data () {
      return {
        gameMain: null,
        stage: null,
        assets: null,
        questions: {},
        isAllRight: false,
        questionsPanelCanvas: null,
        questionsResetCanvas: null,
        questionsSubmitCanvas: null,
        resultCanvas: null,
        setAlpha: 1,
        answerError: [],
        setAnswer: [],
        timer: null
      }
    },
    async mounted () {
      let questions
      // 获取问题
      try {
        questions = await this.$testload()
      } catch (error) {
        questions = localStorage.getItem('questionsConfig')
      }

      // if (!questions) return this.$router.replace('/config')

      this.questions = JSON.parse(questions)

      this.shuffle(this.questions.left.concat(this.questions.useless))

      // 预加载图片
      const Assets = AssetsFectory()
      this.assets = new Assets()
      await this.assets.load()

      // 初始化舞台
      this.gameMain = StageFectory()
      this.stage = this.gameMain.stage
      this.$refs['container'].appendChild(this.stage.canvas)
      const oCanvas = document.querySelector('canvas')

      const { bg, titleBg } = this.assets

      // 准备场景
      const exportScence = new ExportScence({
        x: 0,
        y: 0,
        questions: this.questions,
        images: { bg, titleBg },
        title: this.questions.title,
      })

      // 插入背景
      this.stage.addChild(exportScence)
      this.questionsSubmitCanvas = this.createSubmitButton()
      this.questionsPanelCanvas = this.createPanel('panel')
      // this.resultCanvas = this.createResult()

    },
    methods: {
      createPanel (type = 'panel') {
        const { errorIcon, rightIcon } = this.assets
        // 插入题目 两个板块之间的距离 300 每个背景板的长度 499 106
        const panel = new Panel({
          id: 'panel',
          x: 0,
          y: 0,
          errorIcon,
          rightIcon,
          questions: this.questions,
          alpha: this.setAlpha,
          answerError: this.answerError,
          type,
          stage: this.stage,
          answerError: this.answerError,
          setAnswer: this.setAnswer
        })

        this.stage.addChild(panel)
        // if (type === 'panel') {
        //   this.timer = setInterval(() => {
        //     this.questionsSubmitCanvas.visible = this.questionsPanelCanvas.setAnswer.every(item => item)
        //   }, 300)
        // }

        return panel
      },
      createSubmitButton () {
        // 准备按钮 canvas 1920 1080 , subButton 329 96
        const subBtn = new SubmitButton({
          x: (1920 - 329) / 2,
          y: (1080 - 96) / 2 + 430,
          images: this.assets.submitButton,
          rect: [0, 0, 329, 96],
          visible: true,
          alpha: this.setAlpha,
        })

        subBtn.on(Hilo.event.POINTER_START, (e) => {
          clearInterval(this.timer)

          if (!this.questionsPanelCanvas.setAnswer.every(item => item)) return

          this.setAnswer = this.questionsPanelCanvas.setAnswer

          this.answerError = this.questionsPanelCanvas.setAnswer.filter((item, index) => item.questionId !== this.rightAnser[index])

          this.isAllRight = !this.answerError.length

          // 移除作答模版
          this.stage.removeChild(this.questionsPanelCanvas)

          // 创建显示模版
          this.questionsPanelCanvas = this.createPanel('result')

          this.createModel(subBtn)
        })
        this.stage.addChild(subBtn)

        return subBtn
      },
      createModel (subBtn) {
        const resultModel = new ResultModel({
          x: 0,
          y: 0,
          images: { rightModel: this.assets.rightModel, errorModel: this.assets.errorModel },
          width: 1920,
          height: 1080,
          rect: [0, 0, 1920, 1080],
          isAllRight: this.isAllRight,
          visible: true,
          alpha: this.setAlpha
        })

        // 插入结果 model
        this.stage.addChild(resultModel)

        setTimeout(() => {
          this.questionsResetCanvas = this.createRestButtons()
          this.questionsSubmitCanvas.visible = false
          this.stage.removeChild(resultModel)
        }, 2000)
        return resultModel
      },
      createRestButtons () {
        // 重置按钮
        const repeatX = this.isAllRight ? (1920 - 329) / 2 : (1920 - 329 * 2 - 300) / 2

        const resetButtons = new ResetButton({
          x: repeatX,
          y: (1920 - 96) / 2 + 10,
          images: this.isAllRight ? [this.assets.resetBtn] : [this.assets.rightBtn, this.assets.resetBtn],
          rect: [0, 0, 329, 96],
          isOnlyReset: this.isAllRight,
          visible: true,
          alpha: this.setAlpha
        })

        resetButtons.on(Hilo.event.POINTER_START, (e) => {

          if (this.isAllRight) return this.resetHandel()

          e.eventTarget.id ? this.resetHandel() : this.seachHanel()

        })
        this.stage.addChild(resetButtons)

        return resetButtons
      },
      resetHandel () {
        this.resultCanvas.visible = false

        // 移除显示结果panel
        this.stage.removeChild(this.questionsPanelCanvas)

        this.questionsResetCanvas.visible = false

        // 重置基础信息
        this.setAnswer = []
        this.answerError = []

        this.shuffle(this.questions.content)

        // 重置后创建
        this.questionsPanelCanvas = this.createPanel('panel')
      },
      seachHanel () {
        this.resultCanvas.visible = true
      },
      createResult () {
        const result = new Hilo.Container({
          x: 220,
          y: this.questions.content.length > 7 ? 520 : 440,
          width: 1920 - 220 * 2,
          height: 200,
          visible: false,
        })

        new Text({
          text: `正确答案：${this.questions.result}`,
          fontSize: 30,
          bold: true,
          visible: true,
          alpha: 1,
          reTextWidth: 1920 - 220 * 2,
          height: 60,
          x: 0,
          y: 27,
          color: '#ff4f4f',
          letterSpacing: 10,
        }).addTo(result)
        this.stage.addChild(result)
        return result
      },
      shuffle (arr) {
        for (var i = arr.length - 1; i >= 0; i--) {
          var randomIndex = Math.floor(Math.random() * (i + 1));
          var itemAtIndex = arr[randomIndex];
          arr[randomIndex] = arr[i];
          arr[i] = itemAtIndex;
        }
        this.questions.concat = arr
      },
    }
  }
</script>
