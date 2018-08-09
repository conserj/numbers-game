export default class GameState {
  comboCount = 0
  currState = null
  prevState = null

  getComboCount () {
    return this.comboCount
  }

  setComboCount (comboCount) {
    this.comboCount = comboCount
  }

  getCurrState () {
    return this.currState
  }

  setCurrState (state) {
    this.currState = state
  }

  getPrevState () {
    return this.prevState
  }

  setPrevState (state) {
    this.prevState = state
  }
}
