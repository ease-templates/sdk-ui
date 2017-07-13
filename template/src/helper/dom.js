var _ = require('@/helper/util')
var classnames = require('@/helper/classnames')

var tNode = document.createElement('div')
var addEvent
var removeEvent
var rMouseEvent = /^(?:click|dblclick|contextmenu|DOMMouseScroll|(mouse|touch|pointer)(?:\w+))$/
var doc = document
doc = !doc.compatMode || doc.compatMode === 'CSS1Compat'
  ? doc.documentElement
  : doc.body

var isMobile = /Mobile/i.test(window.navigator.userAgent)
var supportTouch = (function () {
  try {
    document.createEvent('TouchEvent')
    return true
  } catch (e) {
    return false
  }
}())
var supportPointer = (function () {
  try {
    document.createEvent('PointerEvent')
    return true
  } catch (e) {
    return false
  }
}())
var eventKeyMapping = {
  click: 'touchstart',
  mousedown: 'touchstart',
  mousemove: 'touchmove',
  mouseup: 'touchend'
}
var fixed = `_fixed_${Math.random().toString(36).slice(2, 7)}`

function Event (e) {
  e = e || window.event
  if (e[fixed]) return e
  this.event = e
  this.target = e.target || e.srcElement

  var type = (this.type = e.type)

  // if is mouse event patch pageX
  if (rMouseEvent.test(type)) {
    this.clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX)
    this.clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY)
    // fix pageX
    this.pageX = e.pageX != null ? e.pageX : e.clientX + doc.scrollLeft
    this.pageY = e.pageX != null ? e.pageY : e.clientY + doc.scrollTop
    if (type === 'mouseover' || type === 'mouseout') {
      // fix relatedTarget
      var related =
        e.relatedTarget ||
        e[(type === 'mouseover' ? 'from' : 'to') + 'Element']
      while (related && related.nodeType === 3) { related = related.parentNode }
      this.relatedTarget = related
    }
  }

  this[fixed] = true
}

Object.assign(Event.prototype, {
  stop: function () {
    this.preventDefault().stopPropagation()
  },
  preventDefault: function () {
    var event = this.event
    if (!supportTouch && event.preventDefault) event.preventDefault()
    else event.returnValue = false
    return this
  },
  stopPropagation: function () {
    if (this.event.stopPropagation) this.event.stopPropagation()
    else this.event.cancelBubble = true
    return this
  },
  stopImmediatePropagation: function () {
    if (this.event.stopImmediatePropagation) { this.event.stopImmediatePropagation() }
  }
})

var dom = {}

dom.body = document.body
dom.doc = document

dom.isMobile = isMobile
dom.supportTouch = supportTouch
dom.supportPointer = supportPointer

if (tNode.addEventListener) {
  addEvent = function (node, type, fn) {
    node.addEventListener(type, fn, false)
  }
  removeEvent = function (node, type, fn) {
    node.removeEventListener(type, fn, false)
  }
} else {
  addEvent = function (node, type, fn) {
    node.attachEvent('on' + type, fn)
  }
  removeEvent = function (node, type, fn) {
    node.detachEvent('on' + type, fn)
  }
}

dom.on = function (node, type, handler) {
  var types = type.split(' ')
  handler.real = function (ev) {
    var $event = new Event(ev)
    $event.origin = node
    handler.call(node, $event)
  }
  types.map(function (type) {
    switch (true) {
      case isMobile:
        addEvent(node, eventKeyMapping[type] || type, handler.real)
        break
      case !isMobile && supportTouch:
        addEvent(node, type, handler.real)
        type !== 'click' && addEvent(node, eventKeyMapping[type], handler.real)
        break
      default:
        addEvent(node, type, handler.real)
    }
  })
  return dom
}

dom.off = function (node, type, handler) {
  var types = type.split(' ')
  handler = handler.real || handler
  types.map(function (type) {
    switch (true) {
      case isMobile:
        removeEvent(node, eventKeyMapping[type] || type, handler)
        break
      case !isMobile && supportTouch:
        removeEvent(node, type, handler)
        removeEvent(node, eventKeyMapping[type], handler)
        break
      default:
        removeEvent(node, type, handler)
    }
  })
}

dom.find = function (selector, node) {
  node = node || document
  selector = selector.trim()
  if (node.querySelector) {
    return node.querySelector(selector)
  }
  if (/^#[^#]+$/.test(selector)) { return document.getElementById(selector.slice(1)) }
  if (/^\.[^.]+$/.test(selector)) { return dom.getElementsByClassName(selector.slice(1), node)[0] || null }
  if (/^[^.#]+$/.test(selector)) { return node.getElementsByTagName(selector)[0] || null }
  return null
}

dom.findAll = function (selector, node) {
  node = node || document
  selector = selector.trim()
  if (node.querySelectorAll) {
    return node.querySelectorAll(selector)
  }
  if (/^#[^#]+$/.test(selector)) {
    let result = document.getElementById(selector.slice(1))
    return result ? [result] : []
  }
  if (/^\.[^.]+$/.test(selector)) { return dom.getElementsByClassName(selector.slice(1), node) }
  if (/^[^.#]+$/.test(selector)) { return node.getElementsByTagName(selector) }
  return []
}

dom.html = function (node, html) {
  if (_.typeOf(html) === 'undefined') {
    return node.innerHTML
  } else {
    node.innerHTML = html
  }
}

dom.css = function (node, str) {
  node.style.cssText += ';' + str
}

dom.replace = function (node, replaced) {
  if (replaced.parentNode) replaced.parentNode.replaceChild(node, replaced)
}

dom.remove = function (node) {
  if (node.parentNode) node.parentNode.removeChild(node)
}

dom.getComputedStyle = function (node, property) {
  var computedStyle = node.currentStyle || window.getComputedStyle(node, null)
  return property ? computedStyle[property] : computedStyle
}

dom.addClass = function (node, className) {
  if (!node) return
  var current = node.className || ''
  if (!~(' ' + current + ' ').indexOf(' ' + className + ' ')) {
    node.className = current ? current + ' ' + className : className
  }
}

dom.delClass = function (node, className) {
  if (!node) return
  var current = node.className || ''
  node.className = (' ' + current + ' ')
    .replace(' ' + className + ' ', ' ')
    .trim()
}

dom.hasClass = function (node, className) {
  if (!node) return false
  var current = node.className || ''
  return ~(' ' + current + ' ').indexOf(' ' + className + ' ')
}

dom.getElementsByClassName = function (className, node) {
  node = node || document
  if (document.getElementsByClassName) {
    return node.getElementsByClassName(className)
  }
  var children = node.getElementsByTagName('*')
  var current
  var result = []

  for (var i = 0, l = children.length; i < l; i++) {
    current = children[i]
    if (~(' ' + current.className + ' ').indexOf(' ' + className + ' ')) {
      result.push(current)
    }
  }
  return result
}

dom.getBubblePath = function (target, root = document) {
  let path = []
  let current = target
  while (current && current !== root) {
    path.push(current)
    current = current.parentNode
  }
  return path
}

module.exports = dom
