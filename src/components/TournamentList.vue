<template>
<div class="TournamentList">
    <div class="controls">
        <button class="text-button" tabindex="-1"
            v-on:click="$router.push('/')">
            <i class="icon fas fa-angle-left"></i>
            <span class="text">Back</span>
        </button>
    </div>
    <div class="body">
        <div class="title">All Tournaments</div>
        <div class="list-container">
            <div class="headings">
                <span class="heading property name">Name</span>
                <span class="heading property created-at">Created</span>
                <span class="heading property settings">Settings</span>
            </div>
            <div class="tournament" v-for="tournament in tournaments" v-bind:key="tournament.moniker">
                <span class="property name" v-bind:title="tournament.name">
                    <router-link v-bind:to="{ name: 'tournament', params: { moniker : tournament.moniker }}">
                        {{ tournament.name }}
                    </router-link>
                </span>
                <span class="property created-at">{{ formatDate(tournament.created_at) }}</span>
                <span class="property settings">{{ tournament.settings }}</span>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import moment from 'moment';

export default {
    name: 'TournamentList',
    created: function() {
        this.fetchTournaments();
    },
    data: function() {
        return {
            loading: false,
            tournaments: null
        };
    },
    methods: {
        fetchTournaments: function() {
            this.loading = true;
            this.$api.get('/tournament').then((res) => {
                this.tournaments = res.data;
            }).catch((err) => {
                console.error(err);
                this.tournaments = false;
            }).finally(() => {
                this.loading = false;
            });
        },
        formatDate: function(date) {
            return new moment(date).format('Do MMMM YYYY HH:mm');
        }
    }
};
</script>

<style lang="sass">
.TournamentList
    display: flex

    height: 100%
    padding: 20px 0

    .controls
        position: absolute
        top: 0
        left: 0
        padding: 20px
        font-size: 1.5em
        
        button
            font-weight: bold
            opacity: 0.5
            .icon
                margin-right: 3px
            &:hover
                opacity: 0.7

    .body
        margin: auto
        display: flex
        flex-flow: column
        width: 80vw

        @media only screen and (max-width: 900px)
            width: 95vw

    .title
        grid-area: title
        font-size: 5em
        font-weight: bold

        text-align: center

        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        margin-bottom: 20px
        @media only screen and (max-width: 900px)
            font-size: 3em

    .list-container
        overflow-y: auto
        overflow-x: hidden
        border-radius: 5px

        .tournament, .headings
            display: grid
            grid-template-columns: minmax(100px, 200px) minmax(50px, 160px) minmax(100px, 1fr)
            grid-gap: 5px
            padding: 10px 5px
            .property
                overflow: hidden
                text-overflow: ellipsis
                white-space: nowrap
        .headings
            font-weight: bold
            background-color: hsl(153, 16%, 78%)
            .heading
                margin: auto
        .tournament
            .name
                font-weight: bold
</style>
