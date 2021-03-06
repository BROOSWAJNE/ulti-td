/* global INJECTED_DATA */

import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

import router from './router';
import App from './App.vue';

// const subdomains = new URL(window.location).hostname.split('.').slice(0, -2);

Vue.prototype.$api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'csrf-token': INJECTED_DATA.csrfToken,
    },
});
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        //
    },
});

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>',
});
