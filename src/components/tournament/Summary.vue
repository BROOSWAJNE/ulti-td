<template>
<div class="TournamentSummary">
    <div class="controls">
        <button class="text-button" tabindex="-1"
            v-on:click="$router.push('/')">
            <i class="icon fas fa-angle-left"></i>
            <span class="text">Back</span>
        </button>
    </div>
    <div class="loading-view" v-if="loading.tournament">Loading...</div>
    <div class="not-found" v-if="!loading.tournament && !tournament">Tournament not found</div>
    <div class="body" v-if="!loading.tournament && tournament">
        <span class="title">{{ tournament.name }}</span>
        <span class="description">{{ decodeURIComponent(tournament.settings.description) }}</span>
        <section class="teams">
            <span class="section-title">Teams</span>
            <div class="loading-view" v-if="loading.teams">Loading...</div>
            <div class="empty-message" v-if="!loading.teams && !teams.length">No teams</div>
            <div class="teams-list" v-if="!loading.teams && teams.length">
            </div>
        </section>
        <section class="results">
            <span class="section-title">Results</span>
            <div class="empty-message">No results</div>
        </section>
        <section class="spirit">
            <span class="section-title">Spirit</span>
            <div class="empty-message">No spirit scores</div>
        </section>
    </div>
</div>
</template>

<script>
export default {
    name: 'TournamentSummary',
    props: ['moniker'],
    created: function() {
        this.$api.get('/tournament/moniker/'+this.moniker).then((res) => {
            this.tournament = res.data;
            this.loading.tournament = false;

            this.fetchTeams();
        });
    },
    data: function() {
        return {
            loading: {
                tournament: true,
                teams: true
            },
            tournament: null,
            teams: null
        };
    },
    methods: {
        fetchTeams: function() {
            this.loading.teams = true;
            this.$api.get('/team/tournament/' + this.tournament._id).then((res) => {
                this.teams = res.data;
                this.loading.teams = false;
            });
        }
    }
};
</script>

<style lang="sass">
.TournamentSummary
    display: flex
    height: 100%
    overflow: auto

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
    
    .loading-view, .not-found
        margin: auto
        opacity: 0.5

    .body
        margin: auto
        padding: 20px 0
        
        display: grid
        grid-template-areas: "title title" "desc desc" "teams results" "teams spirit"
        grid-template-columns: 50% 50%
        grid-template-rows: auto auto minmax(200px, 1fr) minmax(200px, 1fr)

        width: 80vw

        @media only screen and (max-width: 900px)
            grid-template-areas: "title title" "desc desc" "teams teams" "results results" "spirit spirit"
            grid-template-rows: auto auto repeat(3, minmax(200px, 1fr))
            width: 95vw

    .title
        grid-area: title
        font-size: 5em
        font-weight: bold

        text-align: center

        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap

        border-bottom: 2px solid hsl(153, 16%, 78%)

        width: fit-content
        margin: 0 auto 50px auto
        padding-bottom: 10px

        @media only screen and (max-width: 900px)
            font-size: 3em

    .description
        grid-area: desc
        display: flex
        justify-content: center
        margin-bottom: 50px
        white-space: pre-wrap
        text-align: center

    section
        display: flex
        flex-flow: column
        .section-title
            font-weight: bold
            font-size: 2.5em
            display: flex
            justify-content: center
            @media only screen and (max-width: 900px)
                font-size: 2em

        .empty-message
            display: flex
            align-items: center
            justify-content: center
            opacity: 0.5
            height: 100%

    .teams
        grid-area: teams
    .results
        grid-area: results
    .spirit
        grid-area: spirit

</style>
