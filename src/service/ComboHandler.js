import PlaygroundCellIndex from '../model/PlaygroundCellIndex'
import PlaygroundCellCombo from '../model/PlaygroundCellCombo'

export default class ComboHandler {
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
      let minCell = row === min.getRowIdx() ? min.getCellIdx() : playground.ROW_START
      let maxCell = row === max.getRowIdx() ? max.getCellIdx() : playground.ROW_LENGTH
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

  searchOptimalCombo (playground) {
    let allCombos = []
    playground.getRows().forEach((row) => {
      row.forEach((cell) => {
        if (cell.getValue() === 0) {
          return true
        }
        allCombos = allCombos.concat(this.searchComboHorizontal(cell, playground, this.onComboSearch.bind(this)))
        allCombos = allCombos.concat(this.searchComboHorizontal(cell, playground, this.onComboSearch.bind(this)))
      })
    })

    if (allCombos.length === 0) {
      return null
    }

    let optimalCombo = allCombos.shift()
    if (allCombos.length !== 0) {
      allCombos.forEach((currCombo) => {
        if (optimalCombo.getMin().gt(currCombo.getMin()) && optimalCombo.getMax().lt(currCombo.getMax())) {
          optimalCombo = currCombo
        }
      })
    }

    return optimalCombo
  }

  onComboSearch (rowIndex, cellIndex, comboCell, playground) {
    let candidateCell = playground.getCell(
      new PlaygroundCellIndex(
        rowIndex,
        cellIndex
      )
    )
    if (candidateCell.getValue() === 0) {
      return null
    }

    let candidateCombo = new PlaygroundCellCombo(comboCell, candidateCell)

    if (!this.canNullifyCombo(candidateCombo, playground)) {
      return null
    }

    return candidateCombo
  }

  searchComboHorizontal (cell, playground, onSearch) {
    let horizontalCombos = []
    for (let rowIndex = cell.getRowIdx(); rowIndex < playground.getRowCount(); rowIndex++) {
      let cellIndex = rowIndex !== cell.getRowIdx() ? playground.ROW_START : cell.getCellIdx()
      for (; cellIndex < playground.getRowMaxCell(rowIndex); cellIndex++) {
        let combo = onSearch(rowIndex, cellIndex, cell, playground)
        if (combo) {
          horizontalCombos.push(combo)
        }
      }
    }
    for (let rowIndex = cell.getRowIdx(); rowIndex > 0; rowIndex--) {
      let cellIndex = rowIndex !== cell.getRowIdx() ? playground.ROW_LENGTH : cell.getCellIdx()
      for (; cellIndex > 0; cellIndex--) {
        let combo = onSearch(rowIndex, cellIndex, cell, playground)
        if (combo) {
          horizontalCombos.push(combo)
        }
      }
    }

    return horizontalCombos
  }

  searchComboVertical (cell, playground, onSearch) {
    let verticalCombos = []
    for (let rowIndex = cell.getRowIdx(); rowIndex > 0; rowIndex--) {
      let combo = onSearch(rowIndex, cell.getCellIdx(), cell, playground)
      if (combo) {
        verticalCombos.push(combo)
      }
    }
    for (let rowIndex = cell.getRowIdx(); rowIndex < playground.getRowCount(); rowIndex++) {
      if (playground.getRowMaxCell(rowIndex) >= cell.getIndex().getCell()) {
        let combo = onSearch(rowIndex, cell.getCellIdx(), cell, playground)
        if (combo) {
          verticalCombos.push(combo)
        }
      }
    }

    return verticalCombos
  }
}
