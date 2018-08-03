export default class PlaygroundCellCombo {
  constructor (cellX, cellY) {
    this.cellX = cellX
    this.cellY = cellY
  }

  getMin () {
    return this.cellX.lt(this.cellY) ? this.cellX : this.cellY
  }

  getMax () {
    return this.cellX.gt(this.cellY) ? this.cellX : this.cellY
  }
}
