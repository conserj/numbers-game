import PlaygroundCell from '../model/PlaygroundCell'
import PlaygroundCellIndex from '../model/PlaygroundCellIndex'

export default class Storage {
  constructor (storageKey) {
    this.storageKey = storageKey
  }

  save (rows) {
    sessionStorage.setItem(this.storageKey, JSON.stringify({
      current: rows,
      previous: this.readCurrent(),
      moveCount: this.getMoveCount()
    }))
  }

  getMoveCount () {
    let storedRows = this.getStoredRows()
    if (!storedRows || (storedRows && !storedRows.hasOwnProperty('moveCount'))) {
      return 0
    }

    return storedRows.moveCount
  }

  incrementMoveCount () {
    let json = sessionStorage.getItem(this.storageKey)
    if (json) {
      let obj = JSON.parse(json)
      obj.moveCount = obj.moveCount ? (parseInt(obj.moveCount) + 1) : 1
      sessionStorage.setItem(this.storageKey, JSON.stringify(obj))
    }
    return null
  }

  readCurrent () {
    let result = null
    let storedRows = this.getStoredRows()
    if (!storedRows || (storedRows && !storedRows.hasOwnProperty('current'))) {
      return result
    }

    if (storedRows.current) {
      result = this.transformRows(storedRows.current)
    }
    return result
  }

  readPrevious () {
    let result = null
    let storedRows = this.getStoredRows()
    if (!storedRows || (storedRows && !storedRows.hasOwnProperty('previous'))) {
      return result
    }
    if (storedRows.previous) {
      result = this.transformRows(storedRows.previous)
      sessionStorage.setItem(
        this.storageKey,
        JSON.stringify({
          current: result,
          previous: null,
          moveCount: this.getMoveCount()
        })
      )
    }

    return result
  }

  getStoredRows () {
    let json = sessionStorage.getItem(this.storageKey)
    if (json) {
      return JSON.parse(json)
    }
    return null
  }

  transformRows (rows) {
    rows.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        rows[rowIndex][cellIndex] = new PlaygroundCell(
          new PlaygroundCellIndex(
            rowIndex,
            cellIndex
          ),
          cell.value
        )
      })
    })

    return rows
  }
}
