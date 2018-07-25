export default class AbstractHandler {
  constructor () {
    this.renderer = this.createRenderer()
  }

  setGame (game) {
    this.game = game
    this.game.onModelUpdate((model) => {
      this.renderer.render(model)
    })
  }

  createRenderer () {
    throw new Error('createRenderer is abstract method')
  }

  handleCellPair (pair, playground) {
    let cellA = pair.shift()
    let cellB = pair.pop()

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
        combo.push(
          playground.getCell({
            row: row,
            cell: cell
          })
        )
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
    if ((valA === valB || valB + valA === 10) && isZeroCombo) {
      playground.makeZeroCell(cellCurr)
      playground.makeZeroCell(cellLast)
    }
  }
}
