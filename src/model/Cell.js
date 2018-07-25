export default class Cell {
  constructor (value) {
    this.setValue(parseInt(value))
  }

  getValue () {
    return this.value
  }

  setValue (value) {
    this.value = value
  }
}
