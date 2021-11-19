import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { Tabs, TabPane, Pagination, Button } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import filterDistance from './utils/filterDistance'
import App from './App.vue'

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

Vue.component('Loading', Loading)

Vue.config.productionTip = false

Vue.use(VueAxios, axios)

Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Pagination)
Vue.use(Button)

Vue.filter('distance', filterDistance)

new Vue({
  render: h => h(App)
}).$mount('#app')
