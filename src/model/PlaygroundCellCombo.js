import PlaygroundCell from "./PlaygroundCell";

/**
 * @class PlaygroundCellCombo
 * 
 * @author Serj
 */
export default class PlaygroundCellCombo {
    /**
     * @param {PlaygroundCell} x 
     * @param {PlaygroundCell} y 
     */
    constructor (x, y) {
      this.x = x
      this.y = y
    }

    /**
     * @returns {PlaygroundCell}
     */
    getMin () {
        return this.x.getIndexDelta() < this.y.getIndexDelta() ? this.x : this.y
    }

    /**
     * @returns {PlaygroundCell}
     */
    getMax () {
        return this.x.getIndexDelta() > this.y.getIndexDelta() ? this.x : this.y
    }


}