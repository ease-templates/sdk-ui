/*
 * @Author: 余燕华
 * @Date: 2017-05-11 17:17:13
 * @Last Modified by: 余燕华
 * @Last Modified time: 2017-05-25 17:37:15
 */
var count = 0

/**
 * Task类
 * 执行任务fn，任务完成时需调用Task传给fn的done回调，告知Task任务结束（任务有超时机制，默认6000ms）
 * 举个栗子：
 * let task = new Task(function (done) {
 *   fetch('/api')
 *      .then(res => done(null, res))
 *      .catch(err => done(err))
 * })
 *
 * @param {function} fn
 */
function Task (fn) {
  this.id = ++count
  this.done = false
  this.canceled = false
  this.error = null
  this.timeout = 6000
  this.fn = fn
}
Task.prototype.run = function (cb) {
  var done = (err, data) => {
    if (this.canceled) return
    if (err) {
      this.done = false
      this.error = err
      cb(err, data)
      return
    }
    this.done = true
    cb(null, data)
  }
  this.timer = window.setTimeout(() => {
    done(new Error(`[task: ${this.id}] executed timeout`))
  }, this.timeout)
  this.fn((err, data) => {
    this._clearTimer()
    done(err, data)
  })
}
Task.prototype.cancel = function () {
  this._clearTimer()
  this.canceled = true
}
Task.prototype._clearTimer = function () {
  if (this.timer) {
    clearTimeout(this.timer)
    this.timer = null
  }
}

/**
 * 任务队列执行方法
 *
 * @param {array} _queue 元素只需是Task中的fn，内部会封装成Task
 * @param {function} cb 队列全部执行结束，执行的回调
 */
function execTaskQueue (_queue, cb) {
  if (!_queue.length) return
  var queue = []
  var checkAll = function () {
    var result = true
    for (var j = 0, len = queue.length; j < len; j++) {
      result = result && queue[j].done
      if (!result) break
    }
    return result
  }
  var canceled = false
  var dataArr = []
  // 单独for循环得到完整queue，再依次执行queue中的task，规避IE7、8下的bug
  for (var i = 0, len = _queue.length; i < len; i++) {
    var task = new Task(_queue[i])
    queue.push(task)
  }
  for (i = 0, len = queue.length; i < len; i++) {
    task = queue[i]
    ;(function (index) {
      task.run((err, data) => {
        if (canceled) return
        if (err) {
          canceled = true
          cb(err, data)
          return
        }
        dataArr[index] = data
        if (checkAll()) {
          cb(null, dataArr)
        }
      })
    })(i)
  }
}

module.exports = execTaskQueue
