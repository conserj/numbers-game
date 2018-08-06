export default class PlaygroundCellIndex {
  /**
   * @param {Number} row
   * @param {Number} cell
   */
  constructor (row, cell) {
    this.row = parseInt(row)
    this.cell = parseInt(cell)
  }

  /**
   * @returns {number}
   */
  getRow () {
    return this.row
  }

  /**
   * @returns {number}
   */
  getCell () {
    return this.cell
  }
}
