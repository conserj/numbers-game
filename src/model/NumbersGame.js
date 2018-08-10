import _ from 'lodash'
import Playground from './Playground'

/**
 * @class NumbersGame
 */
export default class NumbersGame {
  /**
   * @param {Playground} playground
   * @param {ComboHandler} comboHandler
   * @param {GameState} gameState
   * @param {StatisticBuilder} statisticBuilder
   * @param {Storage} storage
   */
  constructor (playground, comboHandler, gameState, statisticBuilder, storage) {
    this.playground = playground
    this.comboHandler = comboHandler
    this.gameState = gameState
    this.statisticBuilder = statisticBuilder
    this.gameStorage = storage
    this._onModelUpdate = []
  }

  /**
   * @returns {Playground}
   */
  getPlayground () {
    return this.playground
  }

  /**
   * @return {String}
   */
  getLocale () {
    let locale = this.gameState.getLocale()
    if (!locale) {
      return 'gb'
    }

    return locale
  }

  /**
   * @param {String} locale
   */
  setLocale (locale) {
    this.gameState.setLocale(locale)
    this.gameStorage.saveGameState(this.gameState)
  }

  /**
   * @param {Function} callback
   */
  onModelUpdate (callback = (model) => {}) {
    this._onModelUpdate.push(callback)
  }

  /**
   * @param {PlaygroundCellCombo} combo
   */
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
      this.gameStorage.saveGameState(this.gameState)
    }

    this.fire(this._onModelUpdate, this.playground)
  }

  /**
   * @returns {void}
   */
  clear () {
    let prevState = this.playground.getDepthClone()
    this.playground.clear()
    this.gameState.setCurrState(this.playground.getRows())
    this.gameState.setPrevState(prevState)
    this.gameStorage.saveGameState(this.gameState)
    this.fire(this._onModelUpdate, this.playground)
  }

  /**
   * @return {boolean}
   */
  hasCombinations () {
    return !!this.comboHandler.searchOptimalCombo(this.playground)
  }

  /**
   * @returns {void}
   */
  generatePlayground () {
    let prevState = this.playground.getDepthClone()
    this.playground.generate()
    this.gameState.setPrevState(prevState)
    this.gameState.setCurrState(this.playground.getRows())
    this.gameStorage.saveGameState(this.gameState)

    this.fire(this._onModelUpdate, this.playground)
  }

  /**
   * @return {boolean}
   */
  highlightAvailableCombo () {
    let combo = this.comboHandler.searchOptimalCombo(this.getPlayground())
    if (combo === null) {
      return false
    }

    this.playground.getCell(combo.getMin().getIndex()).setState(1)
    this.playground.getCell(combo.getMax().getIndex()).setState(1)

    return true
  }

  /**
   * @returns {void}
   */
  run () {
    let gameState = this.gameStorage.getGameState()
    if (gameState) {
      this.gameState = gameState
      this.playground.setRows(this.gameState.getCurrState())
    } else {
      this.playground.generate()
      this.gameState.setCurrState(this.playground.getRows())
      this.gameState.setPrevState(null)
      this.gameStorage.saveGameState(this.gameState)
    }

    this.fire(this._onModelUpdate, this.playground)
  }

  /**
   * @returns {void}
   */
  undo () {
    let prevState = this.gameState.getPrevState()
    if (prevState) {
      this.gameState.setCurrState(prevState)
      this.gameState.setPrevState(null)
      this.gameState.setComboCount(this.gameState.getComboCount() - 1)
      this.gameStorage.saveGameState(this.gameState)
      this.playground.setRows(prevState)
    }

    this.fire(this._onModelUpdate, this.playground)
  }

  /**
   * @return {StatisticCollection}
   */
  getStatistics () {
    return this.statisticBuilder.buildStatistic(this.playground, this.gameState)
  }

  /**
   * @returns {void}
   */
  restart () {
    this.playground = new Playground(0)
    this.playground.generate()
    this.gameState.setComboCount(0)
    this.gameState.setCurrState(this.playground.getRows())
    this.gameState.setPrevState(null)
    this.gameStorage.saveGameState(this.gameState)

    this.fire(this._onModelUpdate, this.playground)
  }

  /**
   * @returns {void}
   */
  fire (callbacks, args) {
    args = [args]
    _.forEach(callbacks, (callback) => {
      callback.apply(null, args)
    })
  }
}
