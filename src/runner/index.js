import NumbersGame from '../model/NumbersGame'
import Storage from '../service/Storage'
import Playground from '../model/Playground'
import ComboHandler from '../service/ComboHandler'
import GameState from '../model/GameState'
import StatisticBuilder from '../service/StatisticBuilder'
import ConfigStorage from '../service/ConfigStorage'

let configStorage = new ConfigStorage('GAME_CFG')
let gameConfig = configStorage.get()
let Game = new NumbersGame(
  new Playground(parseInt(gameConfig.mode)),
  new ComboHandler(),
  new GameState(),
  new StatisticBuilder(),
  new Storage('GAME_SESS'),
  gameConfig
)

export default Game
