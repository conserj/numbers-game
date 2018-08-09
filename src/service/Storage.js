import GameState from '../model/GameState'
import PlaygroundCell from '../model/PlaygroundCell'
import PlaygroundCellIndex from '../model/PlaygroundCellIndex'

export default class Storage {
  constructor (storageKey) {
    this.storageKey = storageKey
  }

  getGameState () {
    let json = sessionStorage.getItem(this.storageKey)
    if (json) {
      let obj = JSON.parse(json)
      if (!obj.hasOwnProperty('currState')) {
        throw new Error('GameState is invalid')
      }
      let gameState = new GameState()
      gameState.setPrevState(obj.hasOwnProperty('prevState') ? this.transformRows(obj.prevState) : null)
      gameState.setComboCount(obj.hasOwnProperty('comboCount') ? parseInt(obj.comboCount) : 0)
      gameState.setCurrState(this.transformRows(obj.currState))

      return gameState
    }

    return null
  }

  save (gameState) {
    sessionStorage.setItem(this.storageKey, JSON.stringify(gameState))
  }

  transformRows (rows) {
    if (!rows) {
      return []
    }
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
