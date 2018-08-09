/* eslint-disable no-inner-declarations */
import _ from 'lodash'
import PlayGround from './PlayGround'
import ComboHandler from '../service/ComboHandler'
import GameState from './GameState'
import PlaygroundCell from "./PlaygroundCell"
import PlaygroundCellIndex from "./PlaygroundCellIndex";

export default class NumbersGame {
  constructor (storage) {
    this.playground = new PlayGround()
    this.comboHandler = new ComboHandler()
    this.gameState = new GameState()
    this.gameStorage = storage
    this._onModelUpdate = []
  }

  getModel () {
    return this.playground
  }

  onModelUpdate (callback = (model) => {}) {
    this._onModelUpdate.push(callback)
  }

  comboSelected (combo) {
    let min = combo.getMin()
    let max = combo.getMax()
    let canNullifyPair = this.comboHandler.canNullifyCombo(combo, this.playground)

    if (!canNullifyPair) {
      this.playground.getCell(min.getIndex()).setState(-1)
      this.playground.getCell(max.getIndex()).setState(-1)
    } else {
      let prevState = this.playground.getDepthClone()
      this.playground.makeZeroCell(min)
      this.playground.makeZeroCell(max)
      this.gameState.setPrevState(prevState)
      this.gameState.setCurrState(this.playground.getRows())
      this.gameState.setComboCount(this.gameState.getComboCount() + 1)
      this.gameStorage.save(this.gameState)
    }

    this.fire(this._onModelUpdate, this.playground)
  }

  clear () {
    let prevState = this.playground.getDepthClone()
    this.playground.clear()
    this.gameState.setCurrState(this.playground.getRows())
    this.gameState.setPrevState(prevState)
    this.gameStorage.save(this.gameState)
    this.fire(this._onModelUpdate, this.playground)
  }

  hasCombinations () {
    return !!this.comboHandler.searchOptimalCombo(this.playground)
  }

  generatePlayground () {
    let prevState = this.playground.getDepthClone()
    this.playground.generate()
    this.gameState.setPrevState(prevState)
    this.gameState.setCurrState(this.playground.getRows())
    this.gameStorage.save(this.gameState)

    this.fire(this._onModelUpdate, this.playground)
  }

  help () {
    let combo = this.comboHandler.searchOptimalCombo(this.getModel())
    if (combo === null) {
      return false
    }

    this.playground.getCell(combo.getMin().getIndex()).setState(1)
    this.playground.getCell(combo.getMax().getIndex()).setState(1)

    return true
  }

  run () {
    let gameState = this.gameStorage.getGameState()

    if (gameState) {
      this.gameState = gameState
      this.playground.setRows(this.gameState.getCurrState())
    } else {
      this.playground.generate()
      this.gameState.setCurrState(this.playground.getRows())
      this.gameState.setPrevState(null)
      this.gameStorage.save(this.gameState)
    }

    this.fire(this._onModelUpdate, this.playground)
  }

  undo () {
    let prevState = this.gameState.getPrevState()
    if (prevState) {
      this.gameState.setCurrState(prevState)
      this.gameState.setPrevState(null)
      this.gameState.setComboCount(this.gameState.getComboCount() - 1)
      this.gameStorage.save(this.gameState)
      this.playground.setRows(prevState)
    }

    this.fire(this._onModelUpdate, this.playground)
  }

  getStatistics () {
    let statistics = []
    statistics.push({'title': 'Processed combinations', 'value': this.gameState.getComboCount()})
    statistics.push({'title': 'Rows count', 'value': this.playground.getRowCount()})

    let counts = {}
    this.playground.getRows().forEach((row) => {
      row.forEach((cell) => {
        counts.all = counts.all ? (counts.all + 1) : 1
        if (!counts.hasOwnProperty(cell.getValue())) {
          counts[cell.getValue()] = 0
        }
        counts[cell.getValue()] += 1
      })
    })

    statistics.push({'title': 'Numbers total', 'value': counts.all})
    statistics.push({'title': 'Ones', 'value': counts[1]})
    statistics.push({'title': 'Twos', 'value': counts[2]})
    statistics.push({'title': 'Threes', 'value': counts[3]})
    statistics.push({'title': 'Fours', 'value': counts[4]})
    statistics.push({'title': 'Fives', 'value': counts[5]})
    statistics.push({'title': 'Sixes', 'value': counts[6]})
    statistics.push({'title': 'Sevens', 'value': counts[7]})
    statistics.push({'title': 'Eights', 'value': counts[8]})
    statistics.push({'title': 'Nines', 'value': counts[9]})

    return statistics
  }

  restart () {
    this.playground = new PlayGround()
    this.playground.generate()

    this.gameState.setComboCount(0)
    this.gameState.setCurrState(this.playground.getRows())
    this.gameState.setPrevState(null)

    this.gameStorage.save(this.gameState)

    this.fire(this._onModelUpdate, this.playground)
  }

  fire (callbacks, args) {
    args = [args]
    _.forEach(callbacks, (callback) => {
      callback.apply(null, args)
    })
  }
}
