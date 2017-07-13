if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError(
        'Function.prototype.bind - what is trying to be bound is not callable'
      )
    }

    var aArgs = Array.prototype.slice.call(arguments, 1)
    var fToBind = this
    var Noop = function () {}
    var fBound = function () {
      return fToBind.apply(
        this instanceof Noop ? this : oThis,
        aArgs.concat(Array.prototype.slice.call(arguments))
      )
    }

    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      Noop.prototype = this.prototype
    }
    fBound.prototype = new Noop()

    return fBound
  }
}
