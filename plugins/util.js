import Vue from 'vue'

Vue.prototype.$testsave = async function (thumbnail, rawdata) {
  return new Promise((re, rj) => {
    var httpReq
    httpReq = new XMLHttpRequest()
    httpReq.onreadystatechange = function () {
      if (httpReq.readyState === 4) {
        if (httpReq.status === 200) {
          console.log('send finished')
          re(rawdata)
        } else {
          rj(false)
        }
      }
    }
    var activityparam = { thumbnail: thumbnail, rawdata: rawdata }
    var content = JSON.stringify(activityparam)
    var httpReqUrl =
      'http://localhost:20022/B5798ED3ACA7483C9558743F4D0BC3AA/save'
    httpReq.open('POST', httpReqUrl, true)
    httpReq.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded'
    )
    httpReq.send(content)
  })
}
Vue.prototype.$testload = async function () {
  return new Promise((re, rj) => {
    var httpReq
    httpReq = new XMLHttpRequest()
    httpReq.onreadystatechange = function () {
      if (httpReq.readyState === 4) {
        if (httpReq.status === 200) {
          re(httpReq.responseText)
        } else {
          rj(false)
        }
      }
    }
    var httpReqUrl =
      'http://localhost:20022/B5798ED3ACA7483C9558743F4D0BC3AA/load'
    httpReq.open('GET', httpReqUrl, true)
    httpReq.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded'
    )
    httpReq.send()
  })
}
