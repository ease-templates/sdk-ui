var dom = require('@/helper/dom')
var klass = require('@/helper/klass')
// var _ = require('@/helper/util')

var WrappedEvent = klass({
  initialize (options) {
    var nativeEvent = (this.nativeEvent = options.nativeEvent)
    this.target = nativeEvent.target
    this.currentTarget = options.currentTarget

    this.pageX = nativeEvent.pageX
    this.pageY = nativeEvent.pageY
    this.clientX = nativeEvent.clientX
    this.clientY = nativeEvent.clientY

    this.defaultPrevented = false
    this.cancelBubble = false
    this.cancelImmediateBubble = false
    this.type = nativeEvent.type
  },
  preventDefault () {
    this.defaultPrevented = true
  },
  stopPropagation () {
    this.cancelBubble = true
  },
  stopImmediatePropagation () {
    this.cancelImmediateBubble = true
  }
})

var EventsDelegation = klass({
  initialize (el, events) {
    this.$el = el
    this.initEvents(events)
  },
  initEvents (_events) {
    this._captureEvents = {}
    this._bubbleEvents = {}
    this._delegationHandlers = {}

    var events = this.normalizeEvents(_events)
    Object.keys(events).map(name => {
      var queue = events[name]
      queue.map(eventDesc => {
        this.delegate(name, eventDesc.selector, eventDesc.handler)
      })
      var delegationHandler = (this._delegationHandlers[name] = nativeEvent => {
        let target = nativeEvent.target
        let node = target
        let bubbleEnd = false
        do {
          let hitNode = null
          let eventMapping = this._bubbleEvents[name]
          Object.keys(eventMapping).map(selector => {
            let match = selector.match(/^([.#])([^.#\s]+)$/) || []
            let type = match[1]
            let str = match[2]
            if (
              (type === '.' && ~node.className.indexOf(str)) ||
              (type === '#' && node.id === str)
            ) {
              hitNode = node
              let handlers = eventMapping[selector]
              for (let i = 0; i < handlers.length; i++) {
                let handler = handlers[i]
                var event = new WrappedEvent({
                  nativeEvent,
                  currentTarget: hitNode
                })
                handler.call(hitNode, event)
                if (event.defaultPrevented) nativeEvent.preventDefault()
                if (event.cancelImmediateBubble) {
                  bubbleEnd = true
                  break
                }
              }
              if (event.cancelBubble) bubbleEnd = true
            }
          })
          node = node.parentElement
          if (node === this.$el) bubbleEnd = true
        } while (this.$el && !bubbleEnd && node)
      })

      dom.on(this.$el, name, delegationHandler)
    })
  },
  off () {
    var delegationHandlers = this._delegationHandlers
    for (var name in delegationHandlers) {
      dom.off(this.$el, name, delegationHandlers[name])
    }
    this._captureEvents = {}
    this._bubbleEvents = {}
    this._delegationHandlers = {}
    this.$el = null
  },
  delegate (name, selector, fn) {
    if (!this._bubbleEvents[name]) this._bubbleEvents[name] = {}
    var entry = this._bubbleEvents[name]
    if (!entry[selector]) entry[selector] = []
    var handlers = entry[selector]
    handlers.push(fn)

    return () => {
      var i = handlers.indexOf(fn)
      if (i > -1) {
        handlers.splice(i, 1)
      }
    }
  },
  normalizeEvents (events) {
    var result = {}
    for (var key in events) {
      var [selector, name] = key.split(/\s+/)
      if (!result[name]) result[name] = []
      var entry = result[name]
      entry.push({
        selector,
        handler: events[key]
      })
    }
    return result
  }
})

module.exports = EventsDelegation
