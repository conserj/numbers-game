import NumbersGame from '../model/NumbersGame'
import Storage from '../service/Storage'
import Playground from '../model/Playground'
import ComboHandler from '../service/ComboHandler'
import GameState from '../model/GameState'
import StatisticBuilder from '../service/StatisticBuilder'

let Game = new NumbersGame(
  new Playground(),
  new ComboHandler(),
  new GameState(),
  new StatisticBuilder(),
  new Storage('GAME_SESS')
)

export default Game
