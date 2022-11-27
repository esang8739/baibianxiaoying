import Vue from 'vue'
import VueRouter from 'vue-router'
import TranslaMain from '../views/TranslaMain.vue'
import Record from '../views/Record.vue'
import getWord from '../views/getWord.vue'
import logIn from '../components/logIn.vue'
import HomePerson from '../components/HomePerson.vue'
import WordsList from '../components/WordsList.vue'
Vue.use(VueRouter)


const router = new VueRouter({
    mode: 'history', //设置路由模式为history模式
    routes: [
        { path: '/', redirect: '/logIn' },
        {
            path: '/TranslaMain/:user_id',
            name: 'TranslaMain',
            component: TranslaMain
        },
        {
            path: '/Record',
            name: 'Record',
            component: Record
        }, {
            path: '/getWord',
            name: 'getWord',
            component: getWord
        }, {
            path: '/logIn',
            component: logIn,
            name: 'logIn'
        },
        {
            path: '/HomePerson',
            name: 'HomePerson',
            component: HomePerson,
        },
        {
            path: '/WordsList',
            component: WordsList,
        },
    ]
})

export default router