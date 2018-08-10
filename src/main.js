// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// eslint-disable-next-line
import elements from './elements'
import VueI18n from 'vue-i18n'
import VueResource from 'vue-resource'
import FlagIcon from 'vue-flag-icon'
import ConfigStorage from './service/ConfigStorage'

Vue.use(FlagIcon)
Vue.use(VueResource)
Vue.use(VueI18n)
Vue.config.productionTip = true
const messages = {
  en: {
    buttons: {
      generate: 'Generate',
      undo: 'Undo',
      help: 'Help',
      clear: 'Clear',
      restart: 'Restart'
    },
    statistic: {
      label: 'Game statistic',
      titles: {
        processedCombinations: 'Processed combos',
        rowCount: 'Row count',
        numbersTotal: 'Numbers total',
        ones: 'Ones',
        twos: 'Twos',
        threes: 'Threes',
        fours: 'Fours',
        fives: 'Fives',
        sixes: 'Sixes',
        sevens: 'Sevens',
        eights: 'Eights',
        nines: 'Nines'
      }
    },
    menu: {
      languageLabel: 'Choose language',
      modeLabel: 'Choose mode',
      saveAndPlayText: 'Save and play'
    }
  },
  ua: {
    buttons: {
      generate: 'Згенерувати',
      undo: 'Відмінити',
      help: 'Підказка',
      clear: 'Очистити',
      restart: 'Почати заново'
    },
    statistic: {
      label: 'Ігрова статистика',
      titles: {
        processedCombinations: 'Зібрано комбінацій',
        rowCount: 'Кількість рядків',
        numbersTotal: 'Всього чисел',
        ones: 'Одиниць',
        twos: 'Двійок',
        threes: 'Трійок',
        fours: 'Четвірок',
        fives: 'П\'ятірок',
        sixes: 'Шісток',
        sevens: 'Сімок',
        eights: 'Вісімок',
        nines: 'Дев\'яток'
      }
    },
    menu: {
      languageLabel: 'Виберіть мову',
      modeLabel: 'Виберіть режим',
      saveAndPlayText: 'Зберегти і грати'
    }
  },
  ru: {
    buttons: {
      generate: 'Сгенерировать',
      undo: 'Отменить',
      help: 'Подсказка',
      clear: 'Очистить',
      restart: 'Начать сначала'
    },
    statistic: {
      label: 'Игровая статистика',
      titles: {
        processedCombinations: 'Собрано комбинаций',
        rowCount: 'Количество строк',
        numbersTotal: 'Всего чисел',
        ones: 'Единиц',
        twos: 'Двоек',
        threes: 'Троек',
        fours: 'Четверок',
        fives: 'Пятерок',
        sixes: 'Шестерок',
        sevens: 'Семерок',
        eights: 'Восьмерок',
        nines: 'Девяток'
      }
    },
    menu: {
      languageLabel: 'Выберите язык',
      modeLabel: 'Выберите режим',
      saveAndPlayText: 'Сохранить и играть'
    }
  }
}

let configStorage = new ConfigStorage('GAME_CFG')
let config = configStorage.get()

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: config.lang, // set locale
  messages // set locale messages
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>'
})
