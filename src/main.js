import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import Vueaxios from 'vue-axios'
import url from './assets/url'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
Vue.prototype.url = url
Vue.use(ElementUI);
Vue.use(Vueaxios, axios)

import "mavon-editor/dist/highlightjs/styles/tomorrow-night.min.css"

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
