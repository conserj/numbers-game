/* eslint-disable no-inner-declarations */
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
    let canNullifyPair = this.handler.canNullifyPair(pair, this.model)
    if (!canNullifyPair) {
      this.model.getCell(this.model.indexOfCell(pairClone[0])).setInvalidSelected(true)
      this.model.getCell(this.model.indexOfCell(pairClone[1])).setInvalidSelected(true)
    } else {
      this.model.makeZeroCell(pairClone[0])
      this.model.makeZeroCell(pairClone[1])
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

  searchComboRight () {
    let cel = 0
    let row = 0
    let combos = []
    while (true) {
      let curr = this.model.getCell({
        row: row,
        cell: cel
      })
      let isLastRowCel = cel === this.model.getRowMaxCell(row)
      cel = isLastRowCel ? 0 : (cel + 1)
      row = isLastRowCel ? (row + 1) : row
      let next = this.model.getCell({
        row: row,
        cell: cel
      })

      if (this.handler.canNullifyPair([curr, next], this.model)) {
        combos.push([curr, next])
      }
      if (row === this.model.getMaxRow() && cel === this.model.getRowMaxCell(this.model.getMaxRow())) {
        break
      }
    }

    return combos
  }

  searchComboLeft () {
    let cel = this.model.getRowMaxCell(this.model.getMaxRow())
    let row = this.model.getMaxRow()
    let combos = []
    while (true) {
      let curr = this.model.getCell({
        row: row,
        cell: cel
      })
      let isFirstRowCel = cel === 0
      cel = isFirstRowCel ? 8 : (cel - 1)
      row = isFirstRowCel ? (row - 1) : row
      let prev = this.model.getCell({
        row: row,
        cell: cel
      })

      if (this.handler.canNullifyPair([curr, prev], this.model)) {
        combos.push([curr, prev])
      }
      if (cel === 0 && row === 0) {
        break
      }
    }

    return combos
  }

  searchComboUp () {
    let cel = this.model.getRowMaxCell(this.model.getMaxRow())
    let row = this.model.getMaxRow()
    let combos = []
    while (true) {
      let curr = this.model.getCell({
        row: row,
        cell: cel
      })
      let isFirstRowCel = cel === 0
      row = isFirstRowCel ? (row - 1) : row

      console.log(row, cel)
      if (row - 1 === -1) {
        break
      }
      cel = isFirstRowCel ? 8 : cel - 1
      let prev = this.model.getCell({
        row: row - 1,
        cell: cel
      })

      if (this.handler.canNullifyPair([curr, prev], this.model)) {
        combos.push([curr, prev])
      }
    }

    return combos
  }
}
