/**
 * @class PlaygroundCell
 */
export default class PlaygroundCell {
  /**
   * @param {PlaygroundCellIndex} index
   * @param {Number} value
   */
  constructor (index, value) {
    this.setIndex(index)
    this.setState(0)
    this.setValue(parseInt(value))
  }

  /**
   * @returns {Number}
   */
  getValue () {
    return this.value
  }

  /**
   * @param {Number} value
   */
  setValue (value) {
    this.value = value
  }

  /**
   * @returns {Number}
   */
  getState () {
    return this.state
  }
  /**
   * @param {Number} state
   */
  setState (state) {
    this.state = state
  }

  /**
   * @returns {PlaygroundCellIndex}
   */
  getIndex () {
    return this.index
  }

  /**
   * @param {PlaygroundCellIndex} index
   */
  setIndex (index) {
    this.index = index
  }

  /**
   * @returns {number}
   */
  getRowIdx () {
    return this.getIndex().getRow()
  }

  /**
   * @returns {number}
   */
  getCellIdx () {
    return this.getIndex().getCell()
  }

  /**
   * @param {PlaygroundCell} cell
   * @returns {boolean}
   */
  lt (cell) {
    if (this.getRowIdx() === cell.getRowIdx()) {
      return this.getCellIdx() < cell.getCellIdx()
    }

    return this.getRowIdx() < cell.getRowIdx()
  }

  /**
   * @param {PlaygroundCell} cell
   * @returns {boolean}
   */
  gt (cell) {
    if (this.getRowIdx() === cell.getRowIdx()) {
      return this.getCellIdx() > cell.getCellIdx()
    }

    return this.getRowIdx() > cell.getRowIdx()
  }

  /**
   * @param {PlaygroundCell} cell
   * @returns {boolean}
   */
  eq (cell) {
    return this === cell
  }
}
