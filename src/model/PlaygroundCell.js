export default class PlaygroundCell {
  constructor (index, value) {
    this.setIndex(index)
    this.setState(0)
    this.setValue(parseInt(value))
  }

  getValue () {
    return this.value
  }

  setValue (value) {
    this.value = value
  }

  getState () {
    return this.state
  }

  setState (state) {
    this.state = state
  }

  getIndex () {
    return this.index
  }

  setIndex (index) {
    this.index = index
  }

  getRowIdx () {
    return this.getIndex().getRow()
  }

  getCellIdx () {
    return this.getIndex().getCell()
  }

  lt (cell) {
    if (this.getRowIdx() === cell.getRowIdx()) {
      return this.getCellIdx() < cell.getCellIdx()
    }

    return this.getRowIdx() < cell.getRowIdx()
  }

  gt (cell) {
    if (this.getRowIdx() === cell.getRowIdx()) {
      return this.getCellIdx() > cell.getCellIdx()
    }

    return this.getRowIdx() > cell.getRowIdx()
  }

  eq (cell) {
    return this === cell
  }
}
