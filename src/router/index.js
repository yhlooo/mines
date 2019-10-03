import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/layouts/Home'
import DifficultySelector from '@/components/DifficultySelector'
import Mines from '@/components/Mines'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: '/difficulty',
      children: [
        {
          path: 'difficulty',
          name: 'Difficulty',
          component: DifficultySelector
        }, {
          path: 'game/:width/:height/:mines',
          name: 'Mines',
          component: Mines
        }
      ]
    }
  ]
})
