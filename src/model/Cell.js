export default class Cell {
  constructor (value) {
    this.invalidSelected = false
    this.setValue(parseInt(value))
  }

  getValue () {
    return this.value
  }

  setValue (value) {
    this.value = value
  }

  isInvalidSelected () {
    return this.invalidSelected
  }

  setInvalidSelected (invalidSelected) {
    this.invalidSelected = invalidSelected
  }
}
