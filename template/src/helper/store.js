var klass = require('@/helper/klass')
var _ = require('@/helper/util')

var Store = klass({
  initialize (options) {
    this.state = options.state
    this._committing = false
    this._subscribers = []

    const store = this
    const { dispatch, commit } = this
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload) {
      return commit.call(store, type, payload)
    }

    this.registerMutations(options.mutations)
    this.registerActions(options.actions)
  },
  registerMutations (mutations) {
    this._mutations = Object.assign(this._mutations || {}, mutations)
  },
  registerActions (actions) {
    this._actions = Object.assign(this._actions || {}, actions)
  },
  commit (type, payload) {
    const mutation = { type, payload }
    const entry = this._mutations[type]
    if (!entry) {
      _.error('[Store] unknown mutation type: ' + type)
      return
    }
    this._withCommit(() => {
      entry(this.state, payload)
    })
    this._subscribers.map(sub => sub(mutation, this.state))
  },
  _withCommit (fn) {
    const committing = this._committing
    this._committing = true
    fn()
    this._committing = committing
  },
  dispatch (type, payload) {
    const entry = this._actions[type]
    if (!entry) {
      _.error('[Store] unknown action type: ' + type)
      return
    }
    const context = {
      state: this.state,
      commit: this.commit,
      dispatch: this.dispatch
    }
    return entry(context, payload)
  },
  subscribe (fn) {
    const subs = this._subscribers
    if (subs.indexOf(fn) < 0) {
      subs.push(fn)
    }
    return () => {
      const i = subs.indexOf(fn)
      if (i > -1) {
        subs.splice(i, 1)
      }
    }
  },
  replaceState (state = {}) {
    this.state = state
  }
})

module.exports = Store
