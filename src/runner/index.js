import NumbersGame from '../model/NumbersGame'
import Storage from '../service/Storage'

let storage = new Storage('GAME_SESS')
let Game = new NumbersGame(storage)

export default Game
