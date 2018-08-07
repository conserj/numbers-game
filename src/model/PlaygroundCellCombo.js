/**
 * @class PlaygroundCellCombo
 */
export default class PlaygroundCellCombo {
  /**
   * @param {PlaygroundCell} cellX
   * @param {PlaygroundCell} cellY
   */
  constructor (cellX, cellY) {
    this.cellX = cellX
    this.cellY = cellY
  }

  /**
   * @returns {PlaygroundCell}
   */
  getMin () {
    return this.cellX.lt(this.cellY) ? this.cellX : this.cellY
  }

  /**
   * @returns {PlaygroundCell}
   */
  getMax () {
    return this.cellX.gt(this.cellY) ? this.cellX : this.cellY
  }
}
