import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        admin: {
            username: window.localStorage.getItem('admin' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('admin' || '[]')).username
        }
    },
    mutations: {
        login (state, admin) {
            state.admin = admin
            window.localStorage.setItem('admin', JSON.stringify(admin))
        }
    }
})
