import VueRenderer from './VueRenderer'
import AbstractHandler from './AbstractHandler'

export default class VueHandler extends AbstractHandler {
  createRenderer () {
    return new VueRenderer()
  }
}
