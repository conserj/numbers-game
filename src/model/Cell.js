export default class Cell {
  constructor (value) {
    this.extraClass = ''
    this.setValue(parseInt(value))
  }

  getValue () {
    return this.value
  }

  setValue (value) {
    this.value = value
  }

  getExtraClass () {
    return this.extraClass
  }

  setExtraClass (extraClass) {
    this.extraClass = extraClass
  }
}
