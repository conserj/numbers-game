import TailValue from './TailValue'

export default class PlayGround {
  rows = [];

  constructor () {
    this.generate()
  }

  generate () {
    let data = '1234567891112131415161718'.split('')
    let result = []
    let row = 0

    while (data.length) {
      result[row] = []

      for (let i = 0; i < 9; i++) {
        let value = data.shift()
        if (value === undefined) {
          break
        }

        result[row].push(new TailValue(value))
      }

      row++
    }

    this.rows = result
  }

  setRows (rows) {
    this.rows = rows
  }

  getRows () {
    return this.rows
  }
}
