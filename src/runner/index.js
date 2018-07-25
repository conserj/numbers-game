import NumbersGame from '../model/NumbersGame'
import VueHandler from '../model/VueHandler'

let handler = new VueHandler()
let Game = new NumbersGame(handler)

export default Game
