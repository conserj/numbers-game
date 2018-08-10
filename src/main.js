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

Vue.use(FlagIcon)
Vue.use(VueResource)
Vue.use(VueI18n)
Vue.config.productionTip = true
const messages = {
  gb: {
    buttons: {
      generate: 'Generate',
      undo: 'Undo',
      help: 'Help',
      clear: 'Clear',
      restart: 'Restart',
      language: 'Language',
      OK: 'Yes',
      cancel: 'No'
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
      saveAndPlayText: 'Save and play',
      startNewGameText: 'Start new game',
      continueGameText: 'Continue game'
    },
    endGame: {
      title: 'Congratulations',
      message: '<p>You have finished all the combinations. This time you needed {count} combinations. Press `Start new game` and try to make your result better!</p>',
      button: 'Start new game'
    },
    messages: {
      generatePlaygroundWarning: 'You have unprocessed combinations. Continue?',
      restartMessage: 'Are you sure you want to start a new game? All progress will be lost. Continue?'
    }
  },
  ua: {
    buttons: {
      generate: 'Згенерувати',
      undo: 'Відмінити',
      help: 'Підказка',
      clear: 'Очистити',
      restart: 'Почати заново',
      language: 'Мова',
      OK: 'Так',
      cancel: 'Ні'
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
      saveAndPlayText: 'Зберегти і грати',
      startNewGameText: 'Почати нову гру',
      continueGameText: 'Продовжити гру'
    },
    endGame: {
      title: 'Ура!',
      message: '<p>Ви склали усі комбінації. Цього разу Ви впорались за {count} комбінацій. Натисніть `Почати нову гру` і спробуйте зробити Ваш результат кращим!</p>',
      button: 'Почати нову гру'
    },
    messages: {
      generatePlaygroundWarning: 'Не всі можливі комбінації зібрані. Продовжити?',
      restartMessage: 'Ви впевнені, що хочете почати нову гру? Весь прогрес буде втрачено. Продовжити?'
    }
  },
  ru: {
    buttons: {
      generate: 'Сгенерировать',
      undo: 'Отменить',
      help: 'Подсказка',
      clear: 'Очистить',
      restart: 'Начать сначала',
      language: 'Язык',
      OK: 'Да',
      cancel: 'Нет'
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
      saveAndPlayText: 'Сохранить и играть',
      startNewGameText: 'Начать новую игру',
      continueGameText: 'Продолжить игру'
    },
    endGame: {
      title: 'Ура!',
      message: '<p>Вы собрали все комбинации. На этот раз Вам понадобилось {count} комбинаций. Нажмите `Начать новую игру` и попытайтесь сделать Ваш результат лучше!</p>',
      button: 'Начать новую игру'
    },
    messages: {
      generatePlaygroundWarning: 'Не все возможные комбинации собраны. Продолжить?',
      restartMessage: 'Вы уверены что хотите начать новую игру? Весь прогресс будет утерян. Продолжить?'
    }
  }
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'gb', // set locale
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
