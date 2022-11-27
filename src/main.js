import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { Button, PullRefresh, Search, Lazyload, Icon, Toast, Dialog, Form, Field, Uploader, Image as VanImage, NavBar, Cell, CellGroup } from 'vant'


/* 配置请求根路径，让所有this.$http可补全路径*/
import axios from 'axios'
axios.defaults.baseURL = 'http://wyhzs.top:8002/api'
Vue.prototype.$http = axios;


Vue.use(Button).use(PullRefresh).use(Search).use(Lazyload).use(Icon).use(Toast).use(Dialog).use(Field).use(Form).use(Uploader).use(VanImage).use(NavBar).use(Cell).use(CellGroup)
Vue.use(Lazyload, {
    lazyComponent: true,
});
Vue.config.productionTip = false



new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')