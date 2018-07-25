export default class TailValue {
  constructor (value) {
    this.setValue(value)
  }

  getValue () {
    return this.value
  }

  setValue (value) {
    this.value = value
  }
}
