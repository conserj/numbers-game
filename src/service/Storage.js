import PlaygroundCell from '../model/PlaygroundCell'
import PlaygroundCellIndex from '../model/PlaygroundCellIndex'

export default class Storage {
  constructor (storageKey) {
    this.storageKey = storageKey
  }

  save (rows) {
    sessionStorage.setItem(this.storageKey, JSON.stringify(rows))
  }

  read () {
    let rows = null
    let storedRows = sessionStorage.getItem(this.storageKey)
    if (storedRows) {
      rows = JSON.parse(storedRows)
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
    }

    return rows
  }
}
