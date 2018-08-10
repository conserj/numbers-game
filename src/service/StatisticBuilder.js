import StatisticCollection from '../model/StatisticCollection'
import StatisticRecord from '../model/StatisticRecord'

export default class StatisticBuilder {
  buildStatistic (playground, gameState) {
    let collection = new StatisticCollection()
    collection.addItem(new StatisticRecord('processedCombinations', gameState.getComboCount()))
    collection.addItem(new StatisticRecord('rowCount', playground.getRowCount()))

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

    collection.addItem(new StatisticRecord('numbersTotal', numberCounts.all))
    collection.addItem(new StatisticRecord('ones', numberCounts[1]))
    collection.addItem(new StatisticRecord('twos', numberCounts[2]))
    collection.addItem(new StatisticRecord('threes', numberCounts[3]))
    collection.addItem(new StatisticRecord('fours', numberCounts[4]))
    collection.addItem(new StatisticRecord('fives', numberCounts[5]))
    collection.addItem(new StatisticRecord('sixes', numberCounts[6]))
    collection.addItem(new StatisticRecord('sevens', numberCounts[7]))
    collection.addItem(new StatisticRecord('eights', numberCounts[8]))
    collection.addItem(new StatisticRecord('nines', numberCounts[9]))

    return collection
  }
}
