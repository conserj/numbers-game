import _ from 'lodash'
import PlayGround from './PlayGround'

export default class NumbersGame {
  handler;

  constructor (handler) {
    this.handler = handler
    this.model = new PlayGround()
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
    let pairClone = _.clone(pair)
    let nullified = this.handler.handleCellPair(pair, this.model)
    let extraClass = nullified ? 'success' : 'error'
    this.fire(this._onModelUpdate, this.model)
    this.model.getCell(this.model.indexOfCell(pairClone[0])).setExtraClass(extraClass)
    this.model.getCell(this.model.indexOfCell(pairClone[1])).setExtraClass(extraClass)
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
