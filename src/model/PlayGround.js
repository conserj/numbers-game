import PlaygroundCell from './PlaygroundCell'
import PlaygroundCellIndex from './PlaygroundCellIndex'

export default class PlayGround {
  rows = [];
  ROW_START = 0
  ROW_LENGTH = 8
  constructor () {
    this.rows = []
  }

  generate () {
    let data = []
    if (!this.getRows().length) {
      data = '1234567891112131415161718'.split('')
    } else {
      this.rows.forEach((row) => {
        row.forEach((cell) => {
          if (cell.getValue() !== 0) {
            data.push(cell.getValue())
          }
        })
      })
    }

    let row = 0
    let cell = 0
    if (this.rows.length) {
      row = this.rows.length - 1
      cell = this.rows[row].length
    }

    let i = 0
    let result = []
    this.rows.forEach((row, rowIndex) => {
      result[rowIndex] = []
      row.forEach((cell, cellIndex) => {
        result[rowIndex][cellIndex] = cell
      })
    })
    while (data.length) {
      if (!result[row]) {
        result[row] = []
      }
      if (i !== 0) {
        cell = 0
      }
      for (let i = cell; i < 9; i++) {
        let value = data.shift()
        if (value === undefined) {
          break
        }
        result[row].push(
          new PlaygroundCell(
            new PlaygroundCellIndex(row, i),
            value
          )
        )
      }
      row++
      i++
    }

    this.rows = result
  }

  clear () {
    let newRows = []
    this.rows.forEach((row) => {
      if (row.length < this.ROW_LENGTH) {
        return true
      }
      let rowSumm = row.reduce(
        (accumulator, currentValue) => {
          return accumulator + currentValue.getValue()
        },
        0
      )

      if (rowSumm > 0) {
        newRows.push(row)
      }
    })
    this.rows = newRows
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
