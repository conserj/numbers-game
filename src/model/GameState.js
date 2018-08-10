/**
 * @class GameState
 */
export default class GameState {
  comboCount = 0
  currState = null
  prevState = null
  locale = 'gb'

  /**
   * @return {number}
   */
  getComboCount () {
    return this.comboCount
  }

  /**
   * @param {number} comboCount
   */
  setComboCount (comboCount) {
    this.comboCount = comboCount
  }

  /**
   * @return {Array|null}
   */
  getCurrState () {
    return this.currState
  }

  /**
   * @param {Array} state
   */
  setCurrState (state) {
    this.currState = state
  }

  /**
   * @return {Array|null}
   */
  getPrevState () {
    return this.prevState
  }

  /**
   * @param {Array} state
   */
  setPrevState (state) {
    this.prevState = state
  }

  /**
   * @return {String}
   */
  getLocale () {
    return this.locale
  }

  /**
   * @param {String} locale
   */
  setLocale (locale) {
    this.locale = locale
  }
}
