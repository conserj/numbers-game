import _ from 'lodash'
import PlayGround from './PlayGround'

export default class NumbersGame {
  handler;

  constructor (handler) {
    this.handler = handler
    this.model = new PlayGround()
    this._onModelUpdate = []
    this._onSelectFail = []
    this.handler.setGame(this)
  }

  getModel () {
    return this.model
  }

  onModelUpdate (callback = (model) => {}) {
    this._onModelUpdate.push(callback)
  }

  onSelectFail (callback = (pair) => {}) {
    this._onSelectFail.push(callback)
  }

  pairSelected (pair) {
    var pairClone = _.clone(pair)
    var nullified = this.handler.handleCellPair(pair, this.model)
    this.fire(this._onModelUpdate, this.model)
    if (!nullified) {
      this.fire(this._onSelectFail, pairClone)
    }
  }

  generatePlayground () {
    this.getModel().generate()
    this.fire(this._onModelUpdate, this.model)
  }

  restoreGame (rows) {
    this.getModel().setRows(rows)
    this.fire(this._onModelUpdate, this.model)
  }

  fire (callbacks, args) {
    args = [args]
    _.forEach(callbacks, (callback) => {
      callback.apply(null, args)
    })
  }
}
