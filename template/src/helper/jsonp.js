var count = 0

function noop () {}

function jsonp (url, params, fn, opts) {
  if (typeof fn === 'object') {
    opts = fn
    fn = null
  }
  if (typeof params === 'function') {
    fn = params
    params = null
  }
  if (!opts) opts = {}

  var random = Math.random().toString(36).slice(2, 9)
  var prefix = opts.prefix || '__JSONP'
  var id = opts.name || (prefix + `_${random}` + `_${count++}`)
  var param = opts.param || 'callback'
  var timeout = opts.timeout || 6000
  var enc = window.encodeURIComponent
  var target = document.getElementsByTagName('script')[0] || document.head
  var script
  var timer

  if (timeout) {
    timer = setTimeout(function () {
      cleanup()
      if (fn) fn(new Error('Timeout'))
    }, timeout)
  }

  function cleanup () {
    if (script.parentNode) script.parentNode.removeChild(script)
    window[id] = noop
    if (timer) clearTimeout(timer)
  }

  function cancel () {
    if (window[id]) {
      cleanup()
    }
  }

  function decodeParams (params) {
    var result = []
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        result.push(enc(key) + '=' + enc(params[key]))
      }
    }
    return result.join('&')
  }

  window[id] = function (data) {
    cleanup()
    if (fn) fn(null, data)
  }

  params && (url = url.split('?')[0])
  url += (~url.indexOf('?') ? '&' : '?') + decodeParams(params) + '&' + param + '=' + enc(id)
  url = url.replace('?&', '?')

  script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = url
  target.parentNode.insertBefore(script, target)

  return cancel
}

module.exports = jsonp
