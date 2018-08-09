import StatisticCollection from '../model/StatisticCollection'
import StatisticRecord from '../model/StatisticRecord'

export default class StatisticBuilder {
  buildStatistic (playground, gameState) {
    let collection = new StatisticCollection()
    collection.addItem(new StatisticRecord('Processed combinations', gameState.getComboCount()))
    collection.addItem(new StatisticRecord('Rows count', playground.getRowCount()))

    let numberCounts = {}
    playground.getRows().forEach((row) => {
      row.forEach((cell) => {
        numberCounts.all = numberCounts.all ? (numberCounts.all + 1) : 1
        if (!numberCounts.hasOwnProperty(cell.getValue())) {
          numberCounts[cell.getValue()] = 0
        }
        numberCounts[cell.getValue()] += 1
      })
    })

    collection.addItem(new StatisticRecord('Numbers total', numberCounts.all))
    collection.addItem(new StatisticRecord('Ones', numberCounts[1]))
    collection.addItem(new StatisticRecord('Twos', numberCounts[2]))
    collection.addItem(new StatisticRecord('Threes', numberCounts[3]))
    collection.addItem(new StatisticRecord('Fours', numberCounts[4]))
    collection.addItem(new StatisticRecord('Fives', numberCounts[5]))
    collection.addItem(new StatisticRecord('Sixes', numberCounts[6]))
    collection.addItem(new StatisticRecord('Sevens', numberCounts[7]))
    collection.addItem(new StatisticRecord('Eights', numberCounts[8]))
    collection.addItem(new StatisticRecord('Nines', numberCounts[9]))

    return collection
  }
}
