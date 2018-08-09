import PlaygroundCellIndex from '../model/PlaygroundCellIndex'
import PlaygroundCellCombo from '../model/PlaygroundCellCombo'

/**
 * @class ComboHandler
 */
export default class ComboHandler {
  SEARCH_DIRECTION_HORIZONTAL = 0
  SEARCH_DIRECTION_VERTICAL = 1

  /**
   * @param {PlaygroundCellCombo} combo
   * @param {Playground} playground
   * @returns {boolean}
   */
  canNullifyCombo (combo, playground) {
    let min = combo.getMin()
    let max = combo.getMax()

    if ((min.getValue() === 0 || max.getValue() === 0) || min.eq(max)) {
      return false
    }

    // all values between min cell and max cell
    let comboRelated = []
    for (let row = min.getRowIdx(); row <= max.getRowIdx(); row++) {
      if (min.getCellIdx() === max.getCellIdx()) {
        // vertical mode
        comboRelated.push(playground.getCell(new PlaygroundCellIndex(row, min.getCellIdx())))
        continue
      }

      // horizontal mode
      let minCell = row === min.getRowIdx() ? min.getCellIdx() : playground.rowStart
      let maxCell = row === max.getRowIdx() ? max.getCellIdx() : playground.rowLength
      for (let cell = minCell; cell <= maxCell; cell++) {
        comboRelated.push(playground.getCell(new PlaygroundCellIndex(row, cell)))
      }
    }

    let cellCurr = comboRelated.shift()
    let cellLast = comboRelated.pop()
    if (cellCurr !== min || cellLast !== max) {
      throw new Error('Shit happened')
    }

    let isZeroCombo = true
    if (comboRelated.length > 0) {
      comboRelated.forEach((cell) => {
        if (cell.getValue() !== 0) {
          isZeroCombo = false
          return false
        }
      })
    }

    return (min.getValue() === max.getValue() || min.getValue() + max.getValue() === 10) && isZeroCombo
  }

  /**
   * @param {Playground} playground
   * @returns {PlaygroundCellCombo|null}
   */
  searchOptimalCombo (playground) {
    let combosArray = []

    for (let rowIndex = 0; rowIndex <= playground.getMaxRow(); rowIndex++) {
      for (let cellIndex = 0; cellIndex <= playground.getRowMaxCell(rowIndex); cellIndex++) {
        let cell = playground.getCell(new PlaygroundCellIndex(rowIndex, cellIndex))
        if (cell.getValue() !== 0) {
          let vertical = this.findFirstCombo(cell, playground, this.SEARCH_DIRECTION_VERTICAL)
          if (vertical) {
            combosArray.push(vertical)
          }
          let horizontal = this.findFirstCombo(cell, playground, this.SEARCH_DIRECTION_HORIZONTAL)
          if (horizontal) {
            combosArray.push(horizontal)
          }
        }
      }
      if (combosArray.length) {
        break
      }
    }

    if (combosArray.length !== 0) {
      let optimalCombo = combosArray.shift()
      if (combosArray.length !== 0) {
        combosArray.forEach((currCombo) => {
          if (optimalCombo.getMin().eq(currCombo.getMin())) {
            if (optimalCombo.getMax().gt(currCombo.getMax())) {
              optimalCombo = currCombo
            }
          } else if (optimalCombo.getMin().gt(currCombo.getMin())) {
            optimalCombo = currCombo
          }
        })
      }

      return optimalCombo
    }

    return null
  }

  /**
   * @param {PlaygroundCell} cell
   * @param {Playground} playground
   * @param {Number} direction
   * @returns {PlaygroundCellIndex|null}
   */
  getNextCellIndex (cell, playground, direction) {
    let nextRowIdx = -1
    let nextCellIdx = -1

    switch (direction) {
      case this.SEARCH_DIRECTION_HORIZONTAL:
        nextCellIdx = cell.getCellIdx() + 1
        nextRowIdx = cell.getRowIdx()
        if (cell.getCellIdx() === playground.rowLength) {
          nextCellIdx = 0
          nextRowIdx = nextRowIdx + 1
        }
        break

      case this.SEARCH_DIRECTION_VERTICAL:
        nextCellIdx = cell.getCellIdx()
        nextRowIdx = cell.getRowIdx() + 1
        break

      default:
        throw new Error('Invalid search direction')
    }

    let nextCellIndex = new PlaygroundCellIndex(nextRowIdx, nextCellIdx)
    if (!playground.has(nextCellIndex)) {
      return null
    }

    return nextCellIndex
  }

  /**
   * @param {PlaygroundCell} cell
   * @param {Playground} playground
   * @param {Number} direction
   * @returns {PlaygroundCellCombo|null}
   */
  findFirstCombo (cell, playground, direction) {
    let nextIndex = this.getNextCellIndex(cell, playground, direction)
    if (!nextIndex) {
      return null
    }

    let nextCellObj = playground.getCell(nextIndex)
    if (nextCellObj.getValue() !== 0) {
      let combo = new PlaygroundCellCombo(cell, nextCellObj)
      if (this.canNullifyCombo(combo, playground)) {
        return combo
      }
      return null
    } else {
      nextIndex = this.getNextCellIndex(nextCellObj, playground, direction)
      while (nextIndex !== null) {
        nextCellObj = playground.getCell(nextIndex)
        if (nextCellObj.getValue() !== 0) {
          let combo = new PlaygroundCellCombo(cell, nextCellObj)
          if (this.canNullifyCombo(combo, playground)) {
            return combo
          }
        }
        nextIndex = this.getNextCellIndex(nextCellObj, playground, direction)
      }
    }
    return null
  }
}
