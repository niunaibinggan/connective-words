<template>
  <div class="root">
    <h3 class="root__title-set">
      <input type="text"
             v-model="questions.title"
             placeholder="请输入标题">
    </h3>
    <p style="padding: 10px 0;">题目</p>
    <ul class="root__question">
      <li class="root__question-item"
          v-for="(item, index) in questions.content"
          :key="item.id">
        <span class="root__item-close"
              v-if="current === index && questions.content.length >2"
              :id="'delete'+index"
              @click="deleteIem(index)">+</span>
        <span class="root__item-text"
              v-if="item.text">{{item.text}}</span>
        <input type="text"
               class="root__item-input"
               placeholder="输入正确答案"
               v-model="item.text"
               @focus="focusInput(index)"
               @blur="blurInput(index)"
               @keyup="keyupInput($event,index)">
        <!-- <input type="text"
               class="root__item-symbol"> -->
      </li>
    </ul>

    <div class="root__bottom">
      <div class="root__bottom-contnet">

        <span class="root__add"
              @click="addQuestion">
          +添加填空({{questions.content.length}}/{{target}})
        </span>

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
          content: [
            { id: 0, text: '' },
            { id: 1, text: '' },
          ],
          title: ''
        },
        target: 10,
        current: -1,
        timer: null
      }
    },
    methods: {
      focusInput (index) {
        clearTimeout(this.timer)
        this.current = index
      },
      blurInput (index) {
        this.timer = setTimeout(() => {
          this.current = -1
        }, 200)
      },
      async keyupInput (e, index) {
        if (e.code === 'Enter') {
          e.srcElement.blur()
          if (index === this.questions.content.length - 1) {

            await this.addQuestion()

            this.changeHandelInput(this.questions.content.length - 1, this.questions.content.length - 1)

          } else {
            this.changeHandelInput(index + 1, index + 1)
          }
        }
      },
      deleteIem (index) {
        this.questions.content.splice(index, 1)
        this.current = -1
      },
      addQuestion () {
        if (this.questions.content.length >= this.target) {
          this.$message({
            message: `最多添加${this.target}道题目`,
            type: 'warning'
          })
          return
        }
        let createId = this.questions.content[this.questions.content.length - 1].id + 1
        this.questions.content.push({ id: createId, text: '' })
      },
      defalutConfig () {
        this.questions = {
          content: [
            { id: 0, text: '我是' },
            { id: 1, text: '学生' },
          ],
          title: '连词成句',
          result: '我是学生'
        }
      },
      async submitConfig () {
        const leftVerify = this.questions.content.every(item => item.text)
        if (!leftVerify) {
          this.$message({
            message: `内容不能为空！`,
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

        let allInput = document.querySelectorAll('.root__question input')

        let result = ''
        allInput.forEach((item, index) => {
          result += item.value.trim()
        })
        let setQuestion = this.questions

        setQuestion.result = result

        try {
          const thumbnail = await save(setQuestion)
          await this.$testsave(thumbnail, JSON.stringify(setQuestion))
        } catch (error) {
          localStorage.setItem('questionsConfig', JSON.stringify(setQuestion))
        }
        this.$router.replace('/')
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
    min-width: 400px;
    margin: 0 auto;
    padding: 0 30px;
    font-family: "Microsoft Yahei";
  }
  .root__question {
    margin: 0 auto;
    width: 100%;
    min-width: 400px;
    min-height: 150px;
    overflow: hidden;
    border: 1px solid #ccc;
    padding: 10px;
  }
  .root__question-item {
    float: left;
    padding: 5px 10px;
    cursor: pointer;
    border: 1px solid #ccc;
    margin-right: 30px;
    margin-bottom: 10px;
    position: relative;
    height: 36px;
    min-width: 110px;
    text-align: center;
  }
  .root__item-close {
    position: absolute;
    right: -10px;
    top: -10px;
    width: 20px;
    height: 20px;
    border-radius: 100px;
    background: #fff;
    border: 1px solid #ccc;
    text-align: center;
    line-height: 16px;
    transform: rotate(45deg);
  }

  .root__item-input {
    position: absolute;
    display: inline-block;
    left: 0;
    width: 100%;
    height: 100%;
    height: 25px;
    line-height: 25px;
    text-align: center;
    border: none;
    background: none;
    font-size: 14px;
    color: #5f6c65;
  }
  .root__item-text {
    display: inline-block;
    margin: 0 auto;
    background: #def2da;
    color: transparent;
    border-radius: 4px;
    padding: 2px 7px;
  }

  .root__bottom {
    position: fixed;
    width: 100%;
    height: 40px;
    min-width: 400px;
    bottom: 5%;
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
    background: #ffb647;
    font-size: 12px;
    border-radius: 130px;
    color: #fff;
    cursor: pointer;
  }

  .root__add:hover {
    background: #ffa721;
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

  .root__item-symbol {
    border: none;
    width: 30px;
    position: absolute;
    top: 10px;
    right: -30px;
    text-align: center;
    background: none;
  }
</style>