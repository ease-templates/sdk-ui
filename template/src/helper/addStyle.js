var styleInDom = {}

function attachTagAttrs (element, attrs) {
  Object.keys(attrs).map(function (key) {
    element.setAttribute(key, attrs[key])
  })
}

function insertStyleElement (styleElement) {
  var styleTarget = document.head || document.getElementsByTagName('head')[0]
  styleTarget.appendChild(styleElement)
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  var attrs = {
    type: 'text/css'
  }

  attachTagAttrs(styleElement, attrs)
  insertStyleElement(styleElement)
  return styleElement
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}

module.exports = function addStyle (cssObj) {
  var list = cssObj[0]
  var id = list[0]
  var obj = {
    css: list[1],
    media: list[2]
  }
  !styleInDom[id] && (styleInDom[id] = createStyleElement())
  applyToTag(styleInDom[id], obj)
}
