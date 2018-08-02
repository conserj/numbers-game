/* eslint-disable no-inner-declarations */
import _ from 'lodash'
import PlayGround from './PlayGround'
import ComboHandler from '../service/ComboHandler'

export default class NumbersGame {
  handler;
  comboHandler;

  constructor (handler) {
    this.handler = handler
    this.comboHandler = new ComboHandler()
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
    let canNullifyPair = this.comboHandler.isValidCombo(pair, this.model)
    if (!canNullifyPair) {
      this.model.getCell(pairClone.getMin().getRowIndex(), pairClone.getMin().getCellIndex()).setInvalidSelected(true)
      this.model.getCell(pairClone.getMax().getRowIndex(), pairClone.getMax().getCellIndex()).setInvalidSelected(true)
    } else {
      this.model.makeZeroCell(pairClone.getMin())
      this.model.makeZeroCell(pairClone.getMax())
    }
    this.fire(this._onModelUpdate, this.model)
  }

  generatePlayground () {
    this.getModel().generate()
    this.fire(this._onModelUpdate, this.model)
  }

  help () {
    console.log(this.searchCombo())
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

  searchCombo () {
    let combos = []
    this.model.getRows().forEach((row) => {
      row.forEach((cell) => {
        for (let row = cell.getRowIndex(); row < this.getModel().getRowCount(); row++) {
          for (let cel = row !== cell.getRowIndex() ? 0 : cell.getCellIndex(); cel < this.getModel().getRowMaxCell(row); cel++) {
            let candidate = this.getModel().getCell({
              row: row,
              cell: cel
            })
            if (this.handler.canNullifyPair([cell, candidate], this.getModel())) {
              combos.push([
                cell,
                candidate
              ])
            }
          }
        }
        for (let row = cell.getRowIndex(); row > 0; row--) {
          for (let cel = row !== cell.getRowIndex() ? 8 : cell.getCellIndex(); cel > 0; cel--) {
            let candidate = this.getModel().getCell({
              row: row,
              cell: cel
            })
            if (this.handler.canNullifyPair([cell, candidate], this.getModel())) {
              combos.push([
                cell,
                candidate
              ])
            }
          }
        }
        for (let row = cell.getRowIndex(); row < this.getModel().getRowCount(); row++) {
          if (this.getModel().getRowMaxCell(row) < cell.getCellIndex()) {
            continue
          }
          let candidate = this.getModel().getCell({
            row: row,
            cell: cell.getCellIndex()
          })
          if (this.handler.canNullifyPair([cell, candidate], this.getModel())) {
            combos.push([
              cell,
              candidate
            ])
          }
        }
        for (let row = cell.getRowIndex(); row > 0; row--) {
          let candidate = this.getModel().getCell({
            row: row,
            cell: cell.getCellIndex()
          })
          if (this.handler.canNullifyPair([cell, candidate], this.getModel())) {
            combos.push([
              cell,
              candidate
            ])
          }
        }
      })
    })

    let pair = combos.shift()
    if (!pair) {
      return
    }
    let a = pair.shift()
    let b = pair.pop()
    this.getModel().getCell({row: a.getRowIndex(), cell: a.getCellIndex()}).setHighlighted(true)
    this.getModel().getCell({row: b.getRowIndex(), cell: b.getCellIndex()}).setHighlighted(true)
  }
}
