import PlaygroundCellCombo from "../model/PlaygroundCellCombo";
import PlayGround from "../model/PlayGround";
import PlaygroundCell from "../model/PlaygroundCell";

/**
 * @class ComboHandler
 * @author Serj
 */
export default class ComboHandler {
    /**
     * @param {PlaygroundCellCombo} combo 
     * @param {PlayGround} playground 
     */
    isValidCombo(combo, playground) {
        let x = combo.getMin()
        let y = combo.getMax()

        if ((x.getValue() === 0 || y.getValue() === 0) || x === y) {
            return false
        }

        let related = []
        for (let row = x.getRowIndex(); row <= y.getRowIndex(); row++) {
            let minCell = 0
            let maxCell = playground.CELL_LIMIT

            if (x.getCellIndex() === y.getCellIndex()) {
                minCell = maxCell = x.getCellIndex()
            } else {
                if (row === x.getRowIndex()) {
                    minCell = x.getCellIndex()
                }

                if (row === y.getRowIndex()) {
                    maxCell = y.getCellIndex()
                }
            }

            for (let cell = minCell; cell <= maxCell; cell++) {
                related.push(playground.getCell(row, cell))
            }
        }

        related.shift()
        related.pop()
        let isZeroCombo = true
        if (combo.length > 0) {
            combo.forEach((cell) => {
                if (cell.getValue() !== 0) {
                    isZeroCombo = false
                    return false
                }
            })
        }

        return (x.getValue() === y.getValue() || x.getValue() + y.getValue() === 10) && isZeroCombo
    }

    /**
     * @param {PlayGround} playground 
     */
    findCombo(playground) {
        let combo = null
        playground.getRows().forEach((row) => {
            row.forEach((cell) => {
                combo = this.findRightCombo(cell, playground)
              
                if (!combo) {
                    combo = this.findLeftCombo(cell, playground)
                    if (!combo) {
                        combo = this.findBotCombo(cell, playground)
                        if (!combo) {
                            combo = this.findTopCombo(cell, playground)
                        }
                    }
                }
            })
            if (combo) {
                return false
            }
        })

        return combo
    }

    /**
     * @param {PlaygroundCell} cell 
     * @param {PlayGround} playground
     * 
     * @returns {PlaygroundCellCombo|null} 
     */
    findRightCombo(cell, playground) {
        for (let rowIndex = cell.getRowIndex(); rowIndex < playground.getRowCount(); rowIndex++) {
            let cellIndex = rowIndex !== cell.getRowIndex() ? 0 : cell.getCellIndex();
            for (; cellIndex < playground.getRowMaxCell(rowIndex); cellIndex++) {
                let candidate = playground.getCell(rowIndex, cellIndex)
                let combo = new PlaygroundCellCombo(cell, candidate)
                if (this.isValidCombo(combo, playground)) {
                    return combo
                }
            }
        }

        return null
    }

    /**
     * @param {PlaygroundCell} cell 
     * @param {PlayGround} playground
     * 
     * @returns {PlaygroundCellCombo|null} 
     */
    findLeftCombo(cell, playground) {
        for (let rowIndex = cell.getRowIndex(); rowIndex > 0; rowIndex--) {
            let cellIndex = rowIndex !== cell.getRowIndex() ? playground.CELL_LIMIT : cell.getCellIndex()
            for (; cellIndex > 0; cellIndex--) {
                let candidate = playground.getCell(rowIndex, cellIndex)
                let combo = new PlaygroundCellCombo(cell, candidate)
                if (this.isValidCombo(combo, playground)) {
                    return combo
                }
            }
        }

        return null
    }

    /**
     * @param {PlaygroundCell} cell 
     * @param {PlayGround} playground
     * 
     * @returns {PlaygroundCellCombo|null} 
     */
    findTopCombo(cell, playground) {
        for (let rowIndex = cell.getRowIndex(); rowIndex < playground.getRowCount(); rowIndex++) {
            if (playground.getRowMaxCell(rowIndex) >= cell.getCellIndex()) {
                let candidate = playground.getCell(rowIndex, cell.getCellIndex())
                let combo = new PlaygroundCellCombo(cell, candidate)
                if (this.isValidCombo(combo, playground)) {
                    return combo
                }
            }
        }

        return null
    }

    /**
     * @param {PlaygroundCell} cell 
     * @param {PlayGround} playground
     * 
     * @returns {PlaygroundCellCombo|null} 
     */
    findBotCombo (cell, playground) {
        for (let rowIndex = cell.getRowIndex(); rowIndex > 0; rowIndex--) {
            let candidate = playground.getCell(rowIndex, cell.getCellIndex())
            let combo = new PlaygroundCellCombo(cell, candidate)
            if (this.isValidCombo(combo, playground)) {
                return combo
            }
        }

        return null
    }
}