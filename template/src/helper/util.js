var execTaskQueue = require('@/helper/execTaskQueue')

var o2str = {}.toString

var _ = {
  slice: function (obj, start, end) {
    var res = []
    for (var i = start || 0, len = end || obj.length; i < len; i++) {
      res.push(i)
    }
    return res
  },
  getObjKey: function (obj, val) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] === val) return key
      }
    }
  },
  // beacuse slice and toLowerCase is expensive.
  // we handle undefined and null in another way (by regularjs/util.js)
  typeOf: function (o) {
    return o == null ? String(o) : o2str.call(o).slice(8, -1).toLowerCase()
  },
  isFn: function (o) {
    return typeof o === 'function'
  },
  log: function (type, msg) {
    var types = ['info', 'warn', 'error']
    if (typeof type !== 'string' || !~types.indexOf(type)) {
      _.error(
        'util.log(type, msg): "type" must be one string of ' + types.toString()
      )
      return
    }
    console && console[type]('[{{library}}] ' + msg)
  },
  warn: function (msg) {
    _.log('warn', msg)
  },
  error: function (msg) {
    _.log('error', msg)
  },
  assert: function (condition, msg) {
    if (!condition) throw new Error('[{{library}}] ' + msg)
  },
  msie: function () {
    var ua = navigator.userAgent
    var msie = parseInt((/msie (\d+)/.exec(ua.toLowerCase()) || [])[1])
    if (isNaN(msie)) {
      msie = parseInt(
        (/trident\/.*; rv:(\d+)/.exec(ua.toLowerCase()) || [])[1]
      )
    }
    return msie
  },
  now: function () {
    return new Date().getTime()
  },
  raf: function (cb) {
    var raf =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      function (cb) { window.setTimeout(cb, 16) }
    raf(cb)
  },
  nextFrame: function (fn) {
    _.raf(() => _.raf(fn))
  },
  sample: function (xs, count) {
    var xlen = xs.length
    if (xlen <= count) {
      return xs
    } else {
      var ys = []
      var ylen = 0
      for (var i = 0; i < xlen; i++) {
        if (i >= ylen * (xlen - 1) / (count - 1)) {
          ys.push(xs[i])
          ylen += 1
        }
      }
      return ys
    }
  },
  preloadImages (imgs, onload) {
    var queue = []
    imgs.map(img => {
      let task = function (done) {
        var $img = document.createElement('img')
        $img.onload = () => {
          $img.onload = $img.onerror = null
          done(null, { width: $img.width, height: $img.height, src: img })
        }
        $img.onerror = () => {
          $img.onload = $img.onerror = null
          done(new Error(`img: "${img}" load error`))
        }
        $img.src = img
      }
      queue.push(task)
    })
    execTaskQueue(queue, onload)
  },
  template: function (str, data) {
    /* eslint-disable */
    var escapeRegExp = function(s) {
      return s.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1");
    };
    var templateSettings = {
      start: "<%",
      end: "%>",
      interpolate: /<%=(.+?)%>/g
    };
    var c = templateSettings;
    var endMatch = new RegExp(
      "'(?=[^" + c.end.substr(0, 1) + "]*" + escapeRegExp(c.end) + ")",
      "g"
    );
    var fn = new Function(
      "obj",
      "var p=[],print=function(){p.push.apply(p,arguments);};" +
        "with(obj){p.push('" +
        str
          .replace(/[\r\t\n]/g, " ")
          .replace(endMatch, "\t")
          .split("'")
          .join("\\'")
          .split("\t")
          .join("'")
          .replace(c.interpolate, "',$1,'")
          .split(c.start)
          .join("');")
          .split(c.end)
          .join("p.push('") +
        "');}return p.join('');"
    );
    return data ? fn(data) : fn;
    /* eslint-enable */
  },
  createClass: function (classnames) {}
}

module.exports = _
