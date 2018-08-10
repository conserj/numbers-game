export default class StatisticRecord {
  constructor (statName, value) {
    this.statName = statName
    this.value = value
  }

  getStatName () {
    return this.statName
  }

  getValue () {
    return this.value
  }
}
