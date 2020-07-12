<template>
  <div class="root">
    <h3 class="root__title-set">
      <input type="text"
             v-model="questions.title"
             placeholder="请输入标题">
    </h3>
    <div class="root__name">
      <span class="root__name-drag root__name-common">拖动元素</span>
      <span class="root__name-number"><span style="color: #0ed04b">{{questions.left.concat(questions.useless).length}} </span>/ {{target}}</span>
      <span class="root__name-target root__name-common">配对目标</span>
    </div>
    <div class="root__warpper">
      <div class=root__item
           v-for="(item,index) in questions.left"
           :key="item.id">
        <p class="root__content">
          <span class="root__delete"
                v-if="questions.left.length > 1"
                @click="deleteHandel('content',index)">+</span>
          <span class="root__content-left root__content-common">
            <span class="root__item-text"
                  v-if="item.text">{{item.text}}</span>
            <input type="text"
                   class="root__item-input"
                   placeholder="输入正确答案"
                   v-model="item.text">
          </span>
          <span class="root__line"></span>
          <span class="root__content-right root__content-common">
            <span class="root__item-text"
                  v-if="questions.right[index].text">{{questions.right[index].text}}</span>
            <input type="text"
                   class="root__item-input"
                   placeholder="输入正确答案"
                   v-model="questions.right[index].text">
          </span>
        </p>
      </div>
      <div class="root__item root__item-useless"
           v-for="(item,index) in questions.useless"
           :key="item.id">
        <p class="root__content">
          <span class="root__delete"
                v-if="questions.left.length > 1"
                @click="deleteHandel('useless',index)">+</span>
          <span class="root__content-left root__content-common root__content-useless">
            <span class="root__item-text"
                  v-if="item.text">{{item.text}}</span>
            <input type="text"
                   class="root__item-input"
                   placeholder="输入干扰项"
                   v-model="item.text">
          </span>
        </p>
      </div>
    </div>

    <div class="root__bottom">
      <div class="root__bottom-contnet">
        <span class="root__add"
              style="float: left"
              @click="addQuestion('useless')">增加干扰项</span>
        <span class="root__add"
              @click="addQuestion('content')">增加配对</span>

        <span class="root__submit"
              @click="submitConfig">完成</span>
        <span class="root__default"
              @click="defalutConfig">导入范例</span>
      </div>
    </div>
  </div>
</template>

<script>
  import save from '~/components/game/save'
  export default {
    data () {
      return {
        questions: {
          left: [
            { id: 0, text: '' },
            { id: 1, text: '' },
          ],
          right: [
            { id: 0, text: '' },
            { id: 1, text: '' },
          ],
          useless: [
            { id: -1, text: '' }
          ],
          title: ''
        },
        target: 7,
      }
    },
    methods: {
      deleteHandel (type, index) {
        if (type === 'content') {
          this.questions.left.splice(index, 1)
          this.questions.right.splice(index, 1)
          return
        }
        this.questions.useless.splice(index, 1)
      },
      addQuestion (type) {
        if (this.questions.left.concat(this.questions.useless).length >= this.target) {
          this.$message({
            message: `最多添加${this.target}道题目`,
            type: 'warning'
          })
          return
        }
        if (type === 'content') {
          let createId = this.questions.left[this.questions.left.length - 1].id + 1
          this.questions.left.push({ id: createId, text: '' })
          this.questions.right.push({ id: createId, text: '' })
          return
        }
        let createId = this.questions.useless.length ? this.questions.useless[this.questions.useless.length - 1].id - 1 : -1
        this.questions.useless.push({ id: createId, text: '' })
      },
      async submitConfig () {
        const leftVerify = this.questions.left.every(item => item.text)
        if (!leftVerify) {
          this.$message({
            message: '题目不能为空！',
            type: 'warning'
          })
          return
        }

        const rightVerify = this.questions.right.every(item => item.text)

        if (!rightVerify) {
          this.$message({
            message: `答案不能为空！`,
            type: 'warning'
          })
          return
        }

        const uselessVerify = this.questions.useless.every(item => item.text)

        if (!uselessVerify) {
          this.$message({
            message: `干扰项不能为空！`,
            type: 'warning'
          })
          return
        }

        if (!this.questions.title) {
          this.$message({
            message: `请填写标题！`,
            type: 'warning'
          })
          return
        }

        const leftEqualArr = this.questions.left.concat(this.questions.useless).map(item => item.text.replace(/\s+/g, ""))
        const leftFilter = Array.from(new Set(leftEqualArr))

        // const rightEqualArr = this.questions.right.map(item => item.text.replace(/\s+/g, ""))
        // const rightFilter = Array.from(new Set(rightEqualArr))

        if (leftEqualArr.length !== leftFilter.length) {
          this.$message({
            message: `配对同侧内容不能重复`,
            type: 'warning'
          })
          return
        }

        let setQuestion = this.questions
        try {
          const thumbnail = await save(setQuestion)
          await this.$testsave(thumbnail, JSON.stringify(setQuestion))
        } catch (error) {
          localStorage.setItem('questionsConfig', JSON.stringify(setQuestion))
        }
        this.$router.replace('/')

      },
      defalutConfig () {
        this.questions = {
          left: [
            { id: 0, text: '1+3' },
            { id: 1, text: '2+8' },
          ],
          right: [
            { id: 0, text: 4 },
            { id: 1, text: 10 },
          ],
          useless: [
            { id: -1, text: '2+1' }
          ],
          title: '知识配对'
        }
      },
      changeHandelInput (number, nextNumber) {
        let allInput = document.querySelectorAll('.root__question input')

        allInput[number].focus()

        this.current = nextNumber
      }
    }
  }
</script>
<style scoped>
  .root {
    min-width: 720px;
    margin: 0 auto;
    padding: 0 30px;
    font-family: "Microsoft Yahei";
  }

  .root__warpper {
    max-width: 1100px;
    margin: 0 auto;
    min-width: 695px;
  }

  .root__item {
    padding: 8px;
    cursor: pointer;
  }

  .root__item:hover .root__content-common {
    border: 1px solid #0ed04b;
  }

  .root__item-useless:hover .root__content-common {
    border: 1px solid #ffce42;
    background: rgba(255, 236, 192, 0.4);
  }

  .root__item-useless .root__content-common {
    background: #fdf6ec;
  }

  .root__content {
    position: relative;
    max-width: 1000px;
    min-width: 640px;
    margin: 0 auto;
    height: 40px;
    cursor: pointer;
  }
  .root__item:hover .root__delete {
    display: block;
  }
  .root__delete {
    display: none;
    position: absolute;
    left: -30px;
    top: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #5f6c65;
    width: 23px;
    height: 23px;
    text-align: center;
    line-height: 20px;
    border: 1px solid #ccc;
    border-radius: 100px;
    transform: rotate(45deg);
    cursor: pointer;
  }

  .root__delete:hover {
    color: #fff;
    background: #ff8197;
    border: 1px solid #ff8197;
  }

  .root__content-left {
    float: left;
  }

  .root__content-right {
    float: right;
  }

  .root__content-common {
    width: 320px;
    height: 40px;
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 4px;
    line-height: 38px;
    font-size: 14px;
    position: relative;
    text-align: center;
  }

  .root__item-text {
    display: inline-block;
    margin: 0 auto;
    background: #def2da;
    color: transparent;
    border-radius: 4px;
    height: 30px;
    padding: 0 7px;
    margin-top: 4px;
  }

  .root__line {
    width: calc(100% - 640px);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 1px;
    background: #ccc;
  }

  .root__item:hover .root__line {
    background: #0ed04b;
  }

  .root__content-useless {
    border: 1px solid #f9e099;
  }

  .root__item-input {
    position: absolute;
    display: inline-block;
    left: 0;
    width: 100%;
    height: 38px;
    text-align: center;
    border: none;
    background: none;
    font-size: 14px;
    color: #5f6c65;
    cursor: pointer;
  }

  .root__title-set {
    font-size: 16px;
    color: #5f5c5c;
    margin: 3% 0 2%;
    text-align: center;
    width: 100%;
  }

  .root__title-set input {
    color: #152c2c;
    border: none;
    border: 1px solid #cccccc;
    margin-left: 5px;
    padding: 10px 10px;
    width: 20%;
    font-size: 16px;
  }

  .root__name {
    overflow: hidden;
    max-width: 1000px;
    min-width: 690px;
    position: relative;
    margin: 10px auto 20px;
  }

  .root__name-drag {
    float: left;
  }

  .root__name-target {
    float: right;
    margin-right: 100px;
  }

  .root__name-common::before {
    position: absolute;
    left: -100px;
    top: 16px;
    content: "";
    width: 100px;
    height: 1px;
    background: #ccc;
  }

  .root__name-common {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 100px;
    margin-left: 100px;
    width: 120px;
    height: 35px;
    line-height: 33px;
    text-align: center;
    color: #5f6c65;
    font-size: 14px;
  }

  .root__name-common::after {
    position: absolute;
    left: 120px;
    top: 16px;
    content: "";
    width: 100px;
    height: 1px;
    background: #ccc;
  }

  .root__name-number {
    position: absolute;
    width: 40px;
    height: 40px;
    line-height: 39px;
    text-align: center;
    color: #5f6c65;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    font-size: 14px;
  }

  .root__bottom {
    position: fixed;
    width: 100%;
    height: 40px;
    min-width: 450px;
    bottom: 10px;
    left: 0;
    text-align: center;
  }

  .root__bottom-contnet {
    max-width: 1000px;
    margin: 0 auto;
  }

  .root__add {
    display: inline-block;
    padding: 8px 20px;
    font-size: 12px;
    color: #5f6c65;
    cursor: pointer;
    position: relative;
  }

  .root__add::after {
    content: "+";
    font-weight: bold;
    color: #0ed04b;
    width: 18px;
    height: 18px;
    text-align: center;
    line-height: 15px;
    border: 1px solid #ccc;
    border-radius: 100px;
    cursor: pointer;
    position: absolute;
    left: -2px;
    font-size: 16px;
  }

  .root__add:hover {
    color: #0ed04b;
  }
  .root__add:hover.root__add::after {
    background: #0ed04b;
    border: 1px solid #0ed04b;
    color: #fff;
  }

  .root__title-set {
    font-size: 16px;
    color: #5f5c5c;
    margin: 20px 0;
    text-align: center;
    width: 100%;
  }
  .root__title-set input {
    color: #152c2c;
    border: none;
    border: 1px solid #cccccc;
    margin-left: 5px;
    padding: 10px 10px;
    width: 20%;
    font-family: "微软雅黑";
    font-size: 16px;
  }

  .root__default {
    float: right;
    padding: 8px 20px;
    background: #cccccc;
    font-size: 12px;
    border-radius: 4px;
    color: #5f6c65;
    cursor: pointer;
    margin-right: 20px;
  }

  .root__submit {
    float: right;
    padding: 8px 20px;
    background: #0ed04b;
    font-size: 12px;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
  }
</style>