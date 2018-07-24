export default class Field {
  rows = [];

  constructor () {
    this.rows = []
  }

  setRows (rows) {
    this.rows = rows
  }

  getRows () {
    return this.rows
  }
}
