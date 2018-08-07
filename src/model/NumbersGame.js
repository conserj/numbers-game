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
      this.storage.incrementMoveCount()
    }

    this.fire(this._onModelUpdate, this.model)
  }

  clear () {
    this.getModel().clear()
    this.fire(this._onModelUpdate, this.model)
  }

  hasCombinations () {
    return !!this.comboHandler.searchOptimalCombo(this.getModel())
  }

  generatePlayground () {
    this.getModel().generate()
    this.fire(this._onModelUpdate, this.model)
  }

  help () {
    let combo = this.comboHandler.searchOptimalCombo(this.getModel())
    if (combo !== null) {
      this.model.getCell(combo.getMin().getIndex()).setState(1)
      this.model.getCell(combo.getMax().getIndex()).setState(1)
      return true
    }
    return false
  }

  run () {
    let storedRows = this.storage.readCurrent()
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
    this.storage.save(this.getModel().getRows())
  }

  getStatistics () {
    let statistics = []
    statistics.push({'title': 'Processed combinations', 'value': this.storage.getMoveCount()})
    statistics.push({'title': 'Rows count', 'value': this.getModel().getRowCount()})

    let counts = {}
    this.model.getRows().forEach((row) => {
      row.forEach((cell) => {
        counts.all = counts.all ? (counts.all + 1) : 1
        if (!counts.hasOwnProperty(cell.getValue())) {
          counts[cell.getValue()] = 0
        }
        counts[cell.getValue()] += 1
      })
    })

    statistics.push({'title': 'Numbers total', 'value': counts.all})
    statistics.push({'title': 'Ones', 'value': counts[1]})
    statistics.push({'title': 'Twos', 'value': counts[2]})
    statistics.push({'title': 'Threes', 'value': counts[3]})
    statistics.push({'title': 'Fours', 'value': counts[4]})
    statistics.push({'title': 'Fives', 'value': counts[5]})
    statistics.push({'title': 'Sixes', 'value': counts[6]})
    statistics.push({'title': 'Sevens', 'value': counts[7]})
    statistics.push({'title': 'Eights', 'value': counts[8]})
    statistics.push({'title': 'Nines', 'value': counts[9]})

    return statistics
  }

  restart () {
    this.model = new PlayGround()
    this.getModel().generate()
    this.save()
    this.fire(this._onModelUpdate, this.model)
  }

  fire (callbacks, args) {
    args = [args]
    _.forEach(callbacks, (callback) => {
      callback.apply(null, args)
    })
  }
}
