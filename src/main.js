import Vue from 'vue';
import axios from 'axios';

import router from './router';
import App from './App.vue';

// const subdomains = new URL(window.location).hostname.split('.').slice(0, -2);

Vue.prototype.$api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
});
