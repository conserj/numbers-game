import PlaygroundCell from './PlaygroundCell'
import PlaygroundCellIndex from './PlaygroundCellIndex'

export default class PlayGround {
  rows = [];

  ROW_START = 0
  ROW_LENGTH = 8

  MODE_DEFAULT = 0
  MODE_EXTENDED = 1

  INITIAL_VALUES_DEFAULT = '1234567891112131415161718'
  INITIAL_VALUES_EXTENDED = '1234567891111213141516171819'

  constructor (mode = 0) {
    this.rows = []
    switch (mode) {
      case this.MODE_DEFAULT:
        this.ROW_LENGTH = 8
        this.initialValues = this.INITIAL_VALUES_DEFAULT
        break
      case this.MODE_EXTENDED:
        this.ROW_LENGTH = 9
        this.initialValues = this.INITIAL_VALUES_EXTENDED
        break
      default:
        throw new Error('Unexpected game mode')
    }
  }

  generate () {
    let playgroundValues = []
    if (!this.getRows().length) {
      playgroundValues = this.initialValues.split('')
    } else {
      this.rows.forEach((row) => {
        row.forEach((cell) => {
          if (cell.getValue() !== 0) {
            playgroundValues.push(cell.getValue())
          }
        })
      })
    }

    let startRowIndex = 0
    let startCellIndex = 0
    if (this.getRows().length) {
      startRowIndex = this.getMaxRow()
      startCellIndex = this.getRowMaxCell(startRowIndex) + 1
    }

    let resultRows = []
    this.getRows().forEach((row, rowIndex) => {
      resultRows[rowIndex] = []
      row.forEach((cell, cellIndex) => {
        resultRows[rowIndex][cellIndex] = cell
      })
    })

    this.rows = this.transformRawValuesToPlaygroundRows(
      resultRows,
      playgroundValues,
      startRowIndex,
      startCellIndex
    )
  }

  transformRawValuesToPlaygroundRows (resultRows, playgroundValues, startRowIndex, startCellIndex) {
    while (playgroundValues.length) {
      if (!resultRows[startRowIndex]) {
        resultRows[startRowIndex] = []
      }
      for (let cell = startCellIndex; cell < this.ROW_LENGTH + 1; cell++) {
        let value = playgroundValues.shift()
        if (value === undefined) {
          break
        }
        resultRows[startRowIndex].push(
          new PlaygroundCell(
            new PlaygroundCellIndex(startRowIndex, cell),
            value
          )
        )
      }
      startRowIndex++
      startCellIndex = 0
    }

    return resultRows
  }

  clear () {
    let newPlaygroundValues = []
    this.getRows().forEach((playgroundRow) => {
      let temporaryRow = []
      if (playgroundRow.length < this.ROW_LENGTH) {
        temporaryRow = playgroundRow
      } else {
        let rowSumm = playgroundRow.reduce(
          (accumulator, currentValue) => {
            return accumulator + currentValue.getValue()
          },
          0
        )

        if (rowSumm > 0) {
          temporaryRow = playgroundRow
        }
      }
      if (temporaryRow.length) {
        temporaryRow.forEach((cell) => {
          newPlaygroundValues.push(cell.getValue())
        })
      }
    })

    this.rows = this.transformRawValuesToPlaygroundRows([], newPlaygroundValues, 0, 0)
  }

  getRows () {
    return this.rows
  }

  setRows (rows) {
    this.rows = rows
  }

  getRowCount () {
    return this.getRows().length
  }

  getMaxRow () {
    return this.getRowCount() - 1
  }

  getRowMaxCell (rowIndex) {
    return this.rows[rowIndex].length - 1
  }

  indexOfCell (cell) {
    let result = null
    this.rows.forEach((row, index) => {
      if (row.indexOf(cell) !== -1) {
        result = new PlaygroundCellIndex(index, row.indexOf(cell))
        return false
      }
    })
    if (result === null) {
      throw new Error('Number does not exist')
    }
    return result
  }

  getCell (index) {
    let cell = this.rows[index.getRow()][index.getCell()]
    if (!cell) {
      throw new Error('Number does not exist at: row = ' + index.getRow() + ' cell = ' + index.getCell())
    }
    return cell
  }

  makeZeroCell (cell) {
    cell = this.getCell(this.indexOfCell(cell))
    cell.setValue(0)
  }
}
