import _ from 'lodash'
import PlayGround from './PlayGround'

export default class NumbersGame {
  handler;

  constructor (handler) {
    this.handler = handler
    this.model = new PlayGround()
    window.m = this.model
    window.g = this
    this._onModelUpdate = []
    this.handler.setGame(this)
  }

  getModel () {
    return this.model
  }

  onModelUpdate (callback = (model) => {}) {
    this._onModelUpdate.push(callback)
  }

  pairSelected (pair) {
    this.handlePair(pair)
    this.fire(this._onModelUpdate, this.model)
  }

  handlePair (pair) {
    return null
  }

  fire (callbacks, args = []) {
    _.forEach(callbacks, (callback) => {
      callback.apply(null, args)
    })
  }
}
