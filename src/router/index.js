import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '@/components/IndexPage'
import NumbersGame from '@/components/NumbersGame'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage
    },
    {
      path: '/play',
      name: 'NumbersGame',
      component: NumbersGame
    }
  ]
})
