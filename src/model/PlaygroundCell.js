export default class PlaygroundCell {
  constructor (row, cell, value) {
    this.invalidSelected = false
    this.highlighted = false
    this.setRowIndex(parseInt(row))
    this.setCellIndex(parseInt(cell))
    this.setValue(parseInt(value))
  }

  getValue () {
    return this.value
  }

  setValue (value) {
    this.value = value
  }

  isInvalidSelected () {
    return this.invalidSelected
  }

  setInvalidSelected (invalidSelected) {
    this.invalidSelected = invalidSelected
  }

  isHighlighted () {
    return this.highlighted
  }

  setHighlighted (isHighlighted) {
    this.highlighted = isHighlighted
  }

  getRowIndex () {
    return this.rowIndex
  }

  setRowIndex (rowIndex) {
    this.rowIndex = rowIndex
  }

  getCellIndex () {
    return this.cellIndex
  }

  setCellIndex (cellIndex) {
    this.cellIndex = cellIndex
  }
}
