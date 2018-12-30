<template>
<div class="TournamentCreator">
    <div class="success-container" v-if="created">
        <span class="message">Success! Your tournament is live at:</span>
        <pre class="link">{{ tournament_url }}</pre>
        <span class="message">
            You can use your <router-link v-bind:to="{ name: 'tournament-settings', params: { moniker: moniker }}">admin page</router-link> to add teams to the tournament.
        </span>
    </div>
    <div class="creator-container" v-if="!created">
        <div class="title">{{ name ? name : 'Unnamed Tournament' }}</div>
        <section class="tournament-settings">
            <span class="section-title">Tournament Info</span>
            <label for="name">Name</label>
            <input type="text" v-model.trim="name"
                v-on:keyup="onKeyupName"
                v-bind:disabled="saving">
            <label for="moniker"
                title="The unique identifier used to create the link to your tournament">
                Identifier <span class="example-url">
                    {{ 'ulti.td/t/'+encodeURIComponent(moniker) }}
                </span>
            </label>
            <input type="text" class="input moniker" v-model="moniker"
                v-on:keyup="user_moniker = true; moniker_exists = false" tabindex="-1"
                v-bind:class="{ auto : !user_moniker, invalid : moniker_exists }"
                v-bind:disabled="saving">
            <label for="description">Description</label>
            <textarea cols="30" rows="10" v-model="description" v-bind:disabled="saving"></textarea>
        </section>
        <section class="spirit-settings">
            <span class="section-title">Spirit Settings</span>
            <div class="setting spirit-extreme"
                v-on:click="extreme_comments = !extreme_comments"
                v-bind:class="{ disabled : enforce_comments || saving }"
                title="Forces teams to leave comments when giving spirit scores of 0 or 4 in any category">
                <div class="checkbox" v-bind:class="{ checked : enforce_comments || extreme_comments }"
                    tabindex="0" v-on:keyup.space="extreme_comments = !extreme_comments">
                    <i class="fas fa-square"></i>
                    <i class="fas fa-check-square"></i>
                </div>
                <span class="label">Enforce comments for exceptional scores</span>
            </div>
            <div class="setting spirit-enforce"
                v-on:click="enforce_comments = !enforce_comments"
                v-bind:class="{ disabled : saving }"
                title="Forces teams to leave comments when giving spirit scores lower/higher than 2 in any category">
                <div class="checkbox" v-bind:class="{ checked : enforce_comments }"
                    tabindex="0" v-on:keyup.space="enforce_comments = !enforce_comments">
                    <i class="fas fa-square"></i>
                    <i class="fas fa-check-square"></i>
                </div>
                <span class="label">Enforce comments for non-average scores</span>
            </div>
        </section>
        <section class="admin-settings">
            <span class="section-title">Admin Settings</span>
            <span class="section-description">
                These settings control how you and other tournament admins/TDs will log-in to edit
                tournament settings, view teams entered, review spirit scores, and more.
            </span>
            <label for="password">Admin Password</label>
            <input type="password" v-model="admin_pass" v-bind:disabled="saving">
        </section>
        <span class="error-message">{{ error }}</span>
        <button class="submit action-button"
            v-bind:class="{ saving: saving }"
            v-bind:disabled="!validate() || saving"
            v-on:click="onClickCreate">Create</button>
    </div>
</div>
</template>

<script>
export default {
    name: 'TournamentCreator',
    data: function() {
        return {
            saving: false,
            error: '',
            created: false,
            moniker_exists: false,
            // tournament data
            name: this.$route.query.name || '',
            moniker: this.$route.query.name || '',
            description: `Welcome to ${this.$route.query.name}!`,
            user_moniker: false, // whether user has defined the moniker
            extreme_comments: false,
            enforce_comments: false,
            admin_pass: ''
        };
    },
    computed: {
        tournament_url: function() {
            let url = new URL('/t/' + this.moniker, window.location);
            return url.href;
        }
    },
    methods: {
        onKeyupName: function() {
            if (this.user_moniker) return;
            this.moniker = this.name
                .trim()
                .replace(/ /g, '-')
                .substring(0, 15);
        },
        validate: function() {
            return this.name && this.moniker && this.admin_pass;
        },
        getTournamentData: function() {
            return {
                name: this.name,
                moniker: encodeURIComponent(this.moniker),
                password: this.admin_pass,
                settings: {
                    description: encodeURIComponent(this.description),
                    spirit: {
                        extreme_comments: this.extreme_comments || this.enforce_comments,
                        enforce_comments: this.enforce_comments
                    }
                }
            };
        },
        onClickCreate: function() {
            if (!this.validate()) return;

            this.saving = true;

            this.$api.get('/tournament').then((res) => {
                if (res.data.map(t => t.moniker).includes(encodeURIComponent(this.moniker))) {
                    this.moniker_exists = true;
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
        }
    }
};
</script>

<style lang="sass">
.TournamentCreator
    display: flex

    height: 100%
    width: 100%
    overflow-y: auto

    .success-container
        margin: auto
        text-align: center
        max-width: 90vw
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
        grid-template-areas: "title title" "info admin" "spirit admin" "err err" "btn btn"
        grid-gap: 10px

        margin: auto
        padding: 20px 0

        max-width: 60vw
        @media only screen and (max-width: 900px)
            grid-template-areas: "title title" "info info" "spirit spirit" "admin admin" "err err" "btn btn"
            max-width: 75vw
        @media only screen and (max-width: 700px)
            max-width: 90vw

        .title
            grid-area: title
            font-size: 5em
            font-weight: bold

            text-align: center

            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap

            border-bottom: 2px solid hsl(153, 16%, 78%)
            margin-bottom: 10px
            padding-bottom: 10px

            @media only screen and (max-width: 900px)
                font-size: 3em

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

        .spirit-settings
            grid-area: spirit
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
            height: fit-content

        .checkbox
            font-size: 14px
            margin-right: 5px
</style>
