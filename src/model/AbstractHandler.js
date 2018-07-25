export default class AbstractHandler {
  constructor () {
    this.renderer = this.createRenderer()
  }

  setGame (game) {
    this.game = game
    this.game.onModelUpdate((model) => {
      this.renderer.render(model)
    })
  }

  createRenderer () {
    throw new Error('createRenderer is abstract method')
  }
}
