const _ = require('./util')

module.exports = function animation (el, opts) {
  _.assert(
    el && el.nodeType,
    'transition(el, opts) "el" must be a DOM element!'
  )
  function noop () {}

  var defaultOpts = {
    name: '',
    'enter-class': '',
    'enter-active-class': '',
    'leave-class': '',
    'leave-active-class': '',
    beforeEnter: noop,
    enter: noop,
    afterEnter: noop,
    enterCanceled: noop,
    beforeLeave: noop,
    leave: noop,
    afterLeave: noop,
    leaveCanceled: noop,
    insert: noop
  }
  opts = Object.assign({}, defaultOpts, opts)
  var {
    name,
    beforeEnter,
    enter,
    afterEnter,
    enterCanceled,
    beforeLeave,
    leave,
    afterLeave,
    leaveCanceled,
    insert
  } = opts
  var enterClass = opts['enter-class'] || (name && `${name}-enter`)
  var enterActiveClass = opts['enter-active-class'] || (name && `${name}-enter-active`)
  var leaveClass = opts['leave-class'] || (name && `${name}-leave`)
  var leaveActiveClass = opts['leave-active-class'] || (name && `${name}-leave-active`)
  var hasTransition = !_.msie() || _.msie() > 9
  var transitionEndEvent = 'transitionend'
  var animationEndEvent = 'animationend'
  var enterTransitionEnd = true
  var entering = false
  var leaving = false

  if (
    window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionEndEvent = 'webkitTransitionEnd'
  }
  if (
    !window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationEndEvent = 'webkitAnimationEnd'
  }

  if (hasTransition) {
    var eventHandler = function () {
      if (entering) {
        enterTransitionEnd = true
        entering = false
        dom.delClass(el, enterActiveClass)
        afterEnter(el)
      }
      if (leaving) {
        leaving = false
        dom.delClass(el, leaveActiveClass)
        afterLeave(el)
      }
    }
    el.addEventListener(transitionEndEvent, eventHandler)
    el.addEventListener(animationEndEvent, eventHandler)
  }

  return {
    enter () {
      if (!hasTransition) {
        insert(el)
        afterEnter(el)
        return
      }
      el.className = classnames(
        el.className.trim().split(/\s+/),
        enterClass,
        enterActiveClass
      )
      beforeEnter(el)
      insert(el)
      enterTransitionEnd = false
      entering = true
      _.nextFrame(() => {
        dom.delClass(el, enterClass)
        enter(el)
      })
    },
    leave () {
      if (!hasTransition || !enterTransitionEnd) {
        afterLeave(el)
        return
      }
      el.className = classnames(
        el.className.trim().split(/\s+/),
        leaveClass,
        leaveActiveClass
      )
      beforeLeave(el)
      leaving = true
      _.nextFrame(() => {
        dom.delClass(el, leaveClass)
        leave(el)
      })
    },
    cancelEnter () {
      if (!entering) return
      entering = false
      dom.delClass(el, enterActiveClass)
      enterCanceled(el)
    },
    cancelLeave () {
      if (!leaving) return
      leaving = false
      dom.delClass(el, leaveActiveClass)
      leaveCanceled(el)
    },
    dispose () {
      if (hasTransition) {
        el.removeEventListener(transitionEndEvent, eventHandler)
        el.removeEventListener(animationEndEvent, eventHandler)
      }
      el = null
    }
  }
}
