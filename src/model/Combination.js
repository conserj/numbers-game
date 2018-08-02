export default class Combination {
  find (playground) {
    let combos = []
    let rightCombos = (playground, cell) => {
      let combos = []
      for (let row = cell.getRowIndex(); row < playground.getRowCount(); row++) {
        for (let cel = row !== cell.getRowIndex() ? 0 : cell.getCellIndex(); cel < playground.getRowMaxCell(row); cel++) {
          let candidate = playground.getCell({row: row, cell: cel})
          if (this.isCombination([cell, candidate], playground)) {
            combos.push([cell, candidate])
          }
        }
      }
      return combos
    }

    let leftCombos = (playground, cell) => {
      let combos = []
      for (let row = cell.getRowIndex(); row > 0; row--) {
        for (let cel = row !== cell.getRowIndex() ? 8 : cell.getCellIndex(); cel > 0; cel--) {
          let candidate = playground.getCell({row: row, cell: cel})
          if (this.isCombination([cell, candidate], playground)) {
            combos.push([cell, candidate])
          }
        }
      }
      return combos
    }

    let botCombos = (playground, cell) => {
      let combos = []
      for (let row = cell.getRowIndex(); row < playground.getRowCount(); row++) {
        if (playground.getRowMaxCell(row) < cell.getCellIndex()) {
          continue
        }
        let candidate = playground.getCell({row: row, cell: cell.getCellIndex()})
        if (this.isCombination([cell, candidate], playground)) {
          combos.push([cell, candidate])
        }
      }
      return combos
    }

    let topCombos = (playground, cell) => {
      let combos = []
      for (let row = cell.getRowIndex(); row > 0; row--) {
        if (playground.getRowMaxCell(row) < cell.getCellIndex()) {
          continue
        }
        let candidate = playground.getCell({row: row, cell: cell.getCellIndex()})
        if (this.isCombination([cell, candidate], playground)) {
          combos.push([cell, candidate])
        }
      }
      return combos
    }

    playground.forEach((row) => {
      row.forEach((cell) => {
        combos
          .concat(rightCombos(playground, cell))
          .concat(leftCombos(playground, cell))
          .concat(botCombos(playground, cell))
          .concat(topCombos(playground, cell))
      })
    })
  }

  isCombination (pair, playground) {
    let cellA = pair.shift()
    let cellB = pair.pop()

    if (cellA === cellB) {
      return false
    }

    if (cellA.getValue() === 0 || cellB.getValue() === 0) {
      return false
    }

    /** @todo make CellIndex class */
    let idxA = playground.indexOfCell(cellA)
    let idxB = playground.indexOfCell(cellB)
    let idxMin = idxA.row < idxB.row ? idxA : idxB
    let idxMax = idxA.row < idxB.row ? idxB : idxA

    if (idxMin.row === idxMax.row) {
      idxMin = idxA.cell < idxB.cell ? idxA : idxB
      idxMax = idxA.cell < idxB.cell ? idxB : idxA
    }

    let combo = []
    for (let row = idxMin.row; row <= idxMax.row; row++) {
      let minCell = row === idxMin.row ? idxMin.cell : 0
      let maxCell = row === idxMax.row ? idxMax.cell : 8

      if (idxMin.cell === idxMax.cell) {
        minCell = maxCell = idxMin.cell
      }

      for (let cell = minCell; cell <= maxCell; cell++) {
        combo.push(playground.getCell({row: row, cell: cell}))
      }
    }

    let cellCurr = combo.shift()
    let cellLast = combo.pop()

    let isZeroCombo = true
    if (combo.length > 0) {
      combo.forEach((cell) => {
        if (cell.getValue() !== 0) {
          isZeroCombo = false
          return false
        }
      })
    }

    let valA = cellCurr.getValue()
    let valB = cellLast.getValue()

    return (valA === valB || valB + valA === 10) && isZeroCombo
  }
}
