<template>
<div class="TournamentCreator">
    <div class="success-container" v-if="created">
        <span class="message">Success! Your tournament is live at:</span>
        <pre class="link">{{ tournamentURL }}</pre>
        <span class="message">
            You can use your <router-link v-bind:to="{ name: 'tournament-settings', params: { moniker: moniker }}">admin page</router-link> to add teams to the tournament.
        </span>
    </div>
    <div class="creator-container" v-if="!created">
        <div class="title">{{ name ? name : 'Unnamed Tournament' }}</div>
        <section class="tournament-settings">
            <span class="section-title">Tournament Info</span>
            <label for="name">Name (required)</label>
            <input type="text" v-model.trim="name"
                v-on:keyup="onKeyupName"
                v-bind:disabled="saving">
            <label for="moniker"
                title="The unique identifier used to create the link to your tournament">
                Identifier (required) <span class="example-url">
                    {{ tournamentURL.replace(/^https?:\/\//, '') }}
                </span>
            </label>
            <input type="text" class="input moniker" v-model="moniker"
                v-on:keyup="userMoniker = true; monikerExists = false" tabindex="-1"
                v-bind:class="{ auto : !userMoniker, invalid : monikerExists }"
                v-bind:disabled="saving">
            <label for="description">Description</label>
            <textarea v-model="description" v-bind:disabled="saving"></textarea>
            <label for="tournament-dates">Dates</label>
            <div class="setting tournament-dates">
                <input type="date" v-model="startDate">
                <span>to</span>
                <input type="date" v-model="endDate">
            </div>
        </section>
        <section class="admin-settings">
            <span class="section-title">Admin Settings</span>
            <span class="section-description">
                These settings control how you and other tournament admins/TDs will log-in to edit
                tournament settings, view teams entered, review spirit scores, and more.
            </span>
            <label for="password">Admin Password (required)</label>
            <input type="password" v-model="adminPassword" v-bind:disabled="saving">
        </section>
        <section class="spirit-settings">
            <span class="section-title">Spirit Settings</span>
            <div class="setting spirit-self"
                v-on:click="spiritSelf = !spiritSelf"
                v-bind:class="{ disabled : spiritPublic || saving }"
                title="Full spirit score breakdowns ">
                <div class="checkbox" v-bind:class="{ checked : spiritPublic || spiritSelf }"
                tabindex="0" v-on:keyup.space="spiritSelf = !spiritSelf">
                    <i class="fas fa-square"></i>
                    <i class="fas fa-check-square"></i>
                </div>
                <span class="label">Let teams see their own spirit scores</span>
            </div>
            <div class="setting spirit-public"
                v-on:click="spiritPublic = !spiritPublic"
                v-bind:class="{ disabled : saving }"
                title="Full spirit score breakdowns will be available from your tournament's summary page">
                <div class="checkbox" v-bind:class="{ checked : spiritPublic }"
                tabindex="0" v-on:keyup.space="spiritPublic = !spiritPublic">
                    <i class="fas fa-square"></i>
                    <i class="fas fa-check-square"></i>
                </div>
                <span class="label">Make all spirit scores public</span>
            </div>
            <div class="setting spirit-enforce"
                v-on:click="spiritEnforce = !spiritEnforce"
                v-bind:class="{ disabled : saving }"
                title="Forces teams to submit spirit scores for their matches before they are able to submit the match's results">
                <div class="checkbox" v-bind:class="{ checked : spiritEnforce }"
                tabindex="0" v-on:keyup.space="spiritEnforce = !spiritEnforce">
                    <i class="fas fa-square"></i>
                    <i class="fas fa-check-square"></i>
                </div>
                <span class="label">Require submitting spirit scores before submitting match scores</span>
            </div>
            <div class="setting comments-extreme"
                v-on:click="commentsExtreme = !commentsExtreme"
                v-bind:class="{ disabled : commentsEnforce || saving }"
                title="Forces teams to leave comments when giving spirit scores of 0 or 4 in any category">
                <div class="checkbox" v-bind:class="{ checked : commentsEnforce || commentsExtreme }"
                    tabindex="0" v-on:keyup.space="commentsExtreme = !commentsExtreme">
                    <i class="fas fa-square"></i>
                    <i class="fas fa-check-square"></i>
                </div>
                <span class="label">Enforce comments for extreme scores</span>
            </div>
            <div class="setting comments-enforce"
                v-on:click="commentsEnforce = !commentsEnforce"
                v-bind:class="{ disabled : saving }"
                title="Forces teams to leave comments when giving spirit scores lower/higher than 2 in any category">
                <div class="checkbox" v-bind:class="{ checked : commentsEnforce }"
                    tabindex="0" v-on:keyup.space="commentsEnforce = !commentsEnforce">
                    <i class="fas fa-square"></i>
                    <i class="fas fa-check-square"></i>
                </div>
                <span class="label">Enforce comments for non-average scores</span>
            </div>
        </section>
        <section class="team-settings">
            <span class="section-title">Team Settings</span>
            <div class="setting require-register"
                v-on:click="registrationRequired = !registrationRequired"
                v-bind:class="{ disabled : saving }"
                title="This option is recommended to be left on, as otherwise teams will too easily be able to submit fake scores">
                <div class="checkbox" v-bind:class="{ checked: registrationRequired }"
                    tabindex="0" v-on:keyup.space="registrationRequired = !registrationRequired">
                    <i class="fas fa-square"></i>
                    <i class="fas fa-check-square"></i>
                </div>
                <span class="label">Require registration to submit scores</span>
            </div>
            <span class="section-description">
                {{ registrationRequired ?
                    'Teams are required to accept their invite and log in with their chosen password to submit match and/or spirit scores.' :
                    'Anyone can submit spirit and/or match scores by choosing which team they want to submit as.' }}
            </span>
            <div class="setting open-invites"
                v-on:click="invitesOpen = !invitesOpen"
                v-bind:class="{ disabled : saving }"
                title="Allow anyone to request a tournament invite through your tournament's summary page">
                <div class="checkbox" v-bind:class="{ checked: invitesOpen }"
                    tabindex="0" v-on:keyup.space="invitesOpen = !invitesOpen">
                    <i class="fas fa-square"></i>
                    <i class="fas fa-check-square"></i>
                </div>
                <span class="label">Open tournament invites</span>
            </div>
        </section>
        <span class="error-message">{{ error }}</span>
        <button class="submit action-button"
            v-bind:class="{ saving: saving }"
            v-bind:disabled="!valid || saving"
            v-on:click="onClickCreate">Create</button>
    </div>
</div>
</template>

<script>
function constructMoniker(name) {
    return name
        .trim()
        .replace(/ /g, '-')
        .substring(0, 15);
}

export default {
    name: 'TournamentCreator',
    data: function() {
        return {
            saving: false,
            error: '',
            created: false,
            monikerExists: false,

            // tournament data
            name: this.$route.query.name || '',
            moniker: constructMoniker(this.$route.query.name) || '',
            description: `Welcome to ${this.$route.query.name}!`,
            userMoniker: false, // whether user has defined the moniker

            startDate: '',
            endDate: '',

            spiritSelf: true,
            spiritPublic: true,
            spiritEnforce: false,
            commentsExtreme: true,
            commentsEnforce: false,

            registrationRequired: true,
            invitesOpen: false,

            adminPassword: '',
        };
    },
    computed: {
        tournamentURL: function() {
            let url = new URL('/t/' + encodeURIComponent(this.moniker), window.location);
            return url.href;
        },
        valid: function() {
            return this.name && this.moniker && this.adminPassword;
        },
    },
    methods: {
        onKeyupName: function() {
            if (this.userMoniker) return;
            this.moniker = constructMoniker(this.name);
        },
        getTournamentData: function() {
            return {
                name: this.name,
                moniker: encodeURIComponent(this.moniker),
                password: this.adminPassword,
                settings: {
                    description: encodeURIComponent(this.description),
                    dates: {
                        start: this.startDate ? new Date(this.startDate) : undefined,
                        end: this.endDate ? new Date(this.endDate) : undefined,
                    },
                    spirit: {
                        publish: {
                            self: this.spiritPublic || this.spiritSelf,
                            all: this.spiritPublic,
                        },
                        enforce: this.spiritEnforce,
                        comments: {
                            extreme: this.commentsExtreme || this.commentsEnforce,
                            enforce: this.commentsEnforce,
                        },
                    },
                    teams: {
                        registrationRequired: this.registrationRequired,
                        invitesOpen: this.invitesOpen,
                    },
                },
            };
        },
        onClickCreate: function() {
            if (!this.valid) return;

            this.saving = true;

            this.$api.get('/tournament').then((res) => {
                if (res.data.map(t => t.moniker).includes(encodeURIComponent(this.moniker))) {
                    this.monikerExists = true;
                    throw 'A tournament with this identifier already exists';
                }
                return this.$api.post('/tournament/new', this.getTournamentData());
            }).then((res) => {
                this.created = true;
            }).catch((err) => {
                if (typeof err === 'string') this.error = err;
                else this.error = 'An unknown error occured';
            }).finally(() => {
                this.saving = false;
            });
        },
    },
};
</script>

<style lang="sass">
.TournamentCreator
    display: flex

    height: 100%
    width: 100%

    .success-container
        margin: auto
        text-align: center
        .link
            user-select: all
            overflow: hidden
        .message
            a
                font-weight: bold

    .creator-container
        display: grid
        grid-template-columns: 50% 50%
        // grid-template-rows: repeat(4, auto)
        grid-template-areas: "title title" "info admin" "info spirit" "info teams" "err err" "btn btn"
        grid-gap: 10px

        margin: auto
        padding: 20px 0

        @media only screen and (max-width: 900px)
            grid-template-areas: "title title" "info info" "spirit spirit" "teams teams" "admin admin" "err err" "btn btn"

        .title
            grid-area: title
            font-size: calc(2em + 5vmin)
            font-weight: bold

            text-align: center

            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap

            border-bottom: 2px solid hsl(153, 16%, 78%)
            margin-bottom: 10px
            padding-bottom: 10px

        .error-message
            grid-area: err
            display: flex
            justify-content: center
            color: red
            margin-bottom: 10px

        section
            display: flex
            flex-flow: column

        .section-title
            font-weight: bold
            margin-bottom: 10px
        .section-description
            opacity: 0.7
            margin-bottom: 10px

        .tournament-settings
            grid-area: info
            .example-url
                opacity: 0.5

            .input.moniker.auto
                opacity: 0.5

            .tournament-dates
                display: grid
                grid-template-columns: 1fr auto 1fr
                grid-column-gap: 5px
                align-items: center
                input
                    margin-bottom: 0

        .spirit-settings
            grid-area: spirit
            .setting
                cursor: pointer
                margin-bottom: 5px
                &.spirit-enforce, &.spirit-public
                    margin-bottom: 15px
                &.disabled
                    pointer-events: none
                    opacity: 0.5

        .team-settings
            grid-area: teams
            .setting
                cursor: pointer
                margin-bottom: 5px
                &.disabled
                    pointer-events: none
                    opacity: 0.5

        .admin-settings
            grid-area: admin

        .submit
            grid-area: btn

        label
            margin-bottom: 5px
            white-space: nowrap
            overflow: hidden
        input
            height: 30px
            margin-bottom: 10px
        textarea
            resize: none
            height: 170px
            margin-bottom: 10px
            @media only screen and (max-width: 900px)
                height: 100px

        .checkbox
            font-size: 14px
            margin-right: 5px
</style>
