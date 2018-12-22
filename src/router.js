import Vue from 'vue';
import Router from 'vue-router';

import Home from './components/Home';
import TournamentCreator from './components/TournamentCreator';
import TournamentList from './components/TournamentList';
import TournamentSummary from './components/tournament/Summary';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/new',
            name: 'tournament-creator',
            component: TournamentCreator
        },
        {
            path: '/list',
            name: 'tournament-list',
            component: TournamentList
        },
        {
            path: '/t/:moniker',
            name: 'tournament',
            component: TournamentSummary,
            props: true
        }
    ]
});
