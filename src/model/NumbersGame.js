/* eslint-disable no-inner-declarations */
import _ from 'lodash'
import PlayGround from './PlayGround'
import Game from '../runner'

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
    console.log(this.searchComboLeft())
    console.log(this.searchComboRight())
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

  searchComboLeft () {
    let findLeft = (cell, leftPosRow, leftPosCel) => {
      do {
        let leftCell = this.model.getCell({row: leftPosRow, cell: leftPosCel})
        if (this.handler.canNullifyPair([cell, leftCell], this.model)) {
          console.log(this.model.indexOfCell(cell), this.model.indexOfCell(leftCell))
          return [cell, leftCell]
        }
        leftPosCel = leftPosCel - 1
        if (leftPosCel === -1) {
          leftPosCel = 8
          leftPosRow = leftPosRow - 1
        }
      } while (leftPosRow !== -1 && leftPosCel !== -1)
      return false
    }

    for (let rowIndex = 0; rowIndex < this.model.getRows().length; rowIndex++) {
      for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
        let cell = this.model.getCell({row: rowIndex, cell: cellIndex})
        if (cell.getValue() === 0) {
          continue
        }

        let leftPosCel = cellIndex - 1 === -1 ? 8 : cellIndex - 1
        let leftPosRow = cellIndex - 1 === -1 ? rowIndex - 1 : rowIndex

        if (leftPosRow === -1) {
          continue
        }

        let left = findLeft(cell, leftPosRow, leftPosCel)
        if (left) {
          return left
        }
      }
    }
    return null
  }

  searchComboRight () {
    let findRight = (cell, rightPosRow, rightPosCel) => {
      let maxRow = this.model.getRows().length
      let maxCell = this.model.getRows()[maxRow - 1].length
      do {
        let rightCell = this.model.getCell({row: rightPosRow, cell: rightPosCel})
        if (this.handler.canNullifyPair([cell, rightCell], this.model)) {
          console.log(this.model.indexOfCell(cell), this.model.indexOfCell(rightCell))
          return [cell, rightCell]
        }
        rightPosCel = rightPosCel + 1
        if (rightPosCel === 9) {
          rightPosCel = 0
          rightPosRow = rightPosRow + 1
        }
      } while (rightPosRow !== maxRow && rightPosCel !== maxCell)
      return false
    }

    for (let rowIndex = 0; rowIndex < this.model.getRows().length; rowIndex++) {
      for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
        let cell = this.model.getCell({row: rowIndex, cell: cellIndex})
        if (cell.getValue() === 0) {
          continue
        }

        let leftPosCel = cellIndex + 1 === 9 ? 0 : cellIndex + 1
        let leftPosRow = cellIndex + 1 === 9 ? rowIndex + 1 : rowIndex
        if (leftPosRow === this.model.getRows().length + 1) {
          break
        }
        let right = findRight(cell, leftPosRow, leftPosCel)
        if (right) {
          return right
        }
      }
    }
    return null
  }

  searchComboUp () {
    let findDown = (cell, downPosRow, downPosCel) => {
      do {
        let downCell = this.model.getCell({row: downPosRow, cell: downPosCel})
        if (this.handler.canNullifyPair([cell, downCell], this.model)) {
          console.log(this.model.indexOfCell(cell), this.model.indexOfCell(downCell))
          return [cell, downCell]
        }
        downPosRow++
      } while (downPosRow !== this.model.getRows().length + 1)
      return false
    }

    for (let rowIndex = 0; rowIndex < this.model.getRows().length; rowIndex++) {
      for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
        let cell = this.model.getCell({row: rowIndex, cell: cellIndex})
        if (cell.getValue() === 0) {
          continue
        }

        let downPosCel = cellIndex
        let downPosRow = rowIndex + 1
        let down = findDown(cell, downPosRow, downPosCel)
        if (down) {
          return down
        }
      }
    }
    return null
  }
}
