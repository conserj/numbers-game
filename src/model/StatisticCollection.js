export default class StatisticCollection {
  constructor () {
    this.items = []
  }

  addItem (item) {
    this.items.push(item)
  }

  getAll () {
    return this.items
  }
}
