/* eslint-disable no-inner-declarations */
import _ from 'lodash'
import PlayGround from './PlayGround'
import ComboHandler from '../service/ComboHandler'

export default class NumbersGame {
  constructor (storage) {
    this.storage = storage
    this.model = new PlayGround()
    this.comboHandler = new ComboHandler()
    this._onModelUpdate = []
  }

  getModel () {
    return this.model
  }

  onModelUpdate (callback = (model) => {}) {
    this._onModelUpdate.push(callback)
  }

  comboSelected (combo) {
    let min = combo.getMin()
    let max = combo.getMax()
    let canNullifyPair = this.comboHandler.canNullifyCombo(combo, this.model)

    if (!canNullifyPair) {
      this.model.getCell(min.getIndex()).setState(-1)
      this.model.getCell(max.getIndex()).setState(-1)
    } else {
      this.model.makeZeroCell(min)
      this.model.makeZeroCell(max)
    }

    this.fire(this._onModelUpdate, this.model)
  }

  clear () {
    this.getModel().clear()
    this.fire(this._onModelUpdate, this.model)
  }

  generatePlayground () {
    this.getModel().generate()
    this.fire(this._onModelUpdate, this.model)
  }

  help () {
    let combo = this.comboHandler.searchOptimalCombo(this.model)
    if (combo !== null) {
      this.model.getCell(combo.getMin().getIndex()).setState(1)
      this.model.getCell(combo.getMax().getIndex()).setState(1)
      return true
    }
    return false
  }

  run () {
    let storedRows = this.storage.read()
    if (storedRows) {
      this.getModel().setRows(storedRows)
    } else {
      this.getModel().generate()
      this.save()
    }
    this.fire(this._onModelUpdate, this.model)
  }

  undo () {
    let storedRows = this.storage.readPrevious()
    if (storedRows) {
      this.getModel().setRows(storedRows)
    }
    this.fire(this._onModelUpdate, this.model)
  }

  save () {
      console.log('here')
    this.storage.save(this.getModel().getRows())
  }

  fire (callbacks, args) {
    args = [args]
    _.forEach(callbacks, (callback) => {
      callback.apply(null, args)
    })
  }
}
