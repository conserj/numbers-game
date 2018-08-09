import PlaygroundCell from './PlaygroundCell'
import PlaygroundCellIndex from './PlaygroundCellIndex'

export default class Playground {
  rows = []

  rowStart = 0
  rowLength = 0

  MODE_DEFAULT = 0
  MODE_EXTENDED = 1

  constructor (mode = 0) {
    this.rows = []
    switch (mode) {
      case this.MODE_DEFAULT:
        this.rowLength = 8
        this.initialValues = '1234567891112131415161718'
        break
      case this.MODE_EXTENDED:
        this.rowLength = 9
        this.initialValues = '1234567891111213141516171819'
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
      for (let cell = startCellIndex; cell < this.rowLength + 1; cell++) {
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
      if (playgroundRow.length < this.rowLength) {
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

  has (index) {
    try {
      return !!this.getCell(index)
    } catch (e) {
      return false
    }
  }

  makeZeroCell (cell) {
    cell = this.getCell(this.indexOfCell(cell))
    cell.setValue(0)
  }

  getDepthClone () {
    let depthClone = []
    this.rows.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (!depthClone[rowIndex]) {
          depthClone[rowIndex] = []
        }
        depthClone[rowIndex][cellIndex] = new PlaygroundCell(
          new PlaygroundCellIndex(
            cell.getRowIdx(),
            cell.getCellIdx()
          ),
          cell.getValue()
        )
      })
    })
    return depthClone
  }

  isCompleted () {
    for (let rowIndex = 0; rowIndex <= this.getMaxRow(); rowIndex++) {
      for (let cellIndex = 0; cellIndex <= this.getRowMaxCell(rowIndex); cellIndex++) {
        if (this.rows[rowIndex][cellIndex].getValue() !== 0) {
          return false
        }
      }
    }
    return true
  }
}
