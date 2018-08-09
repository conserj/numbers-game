export default class StatisticRecord {
  constructor (title, value) {
    this.title = title
    this.value = value
  }

  getTitle () {
    return this.title
  }

  getValue () {
    return this.value
  }
}
