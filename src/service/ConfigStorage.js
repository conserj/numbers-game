export default class ConfigStorage {
  constructor (storageKey) {
    this.storageKey = storageKey
  }

  save (config) {
    sessionStorage.setItem(this.storageKey, JSON.stringify(config))
  }

  get () {
    let config = sessionStorage.getItem(this.storageKey)
    if (!config) {
      return {
        mode: '0',
        lang: 'en'
      }
    }
    return JSON.parse(config)
  }
}
