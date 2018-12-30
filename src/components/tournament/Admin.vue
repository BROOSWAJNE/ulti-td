<template>
<div class="TournamentSettings">
    <div class="auth-container" v-if="!authenticated">
        <label for="password">Admin Password</label>
        <div class="input">
            <input type="password" class="input password has-submit" v-model="password"
                v-on:keyup="error.auth = ''" ref="input_password"
                v-on:keyup.enter="onAuthenticate"
                v-bind:disabled="loading.authenticating">
            <button class="input-submit-button"
                v-on:click="onAuthenticate"
                v-bind:class="{ hidden: !password }"
                v-bind:disabled="loading.authenticating">
                <i class="fas fa-caret-right"></i>
            </button>
        </div>
        <span class="auth-error">{{ error.auth }}</span>
    </div>
    <div class="body" v-if="authenticated && tournament">
        <span class="name">{{ tournament.name }}</span>

        <section class="tournament-settings">
            <span class="section-title">Tournament Info</span>
            <label for="name">Name</label>
            <input type="text" v-model.trim="tournament.name"
                v-bind:disabled="loading.saving">
            <label for="description">Description</label>
            <textarea cols="30" rows="10" v-model="description" v-bind:disabled="loading.saving"></textarea>
        </section>
        <section class="spirit-settings">
            <span class="section-title">Spirit Settings</span>
            <div class="setting spirit-extreme"
                v-on:click="tournament.settings.spirit.extreme_comments = !tournament.settings.spirit.extreme_comments"
                v-bind:class="{ disabled : tournament.settings.spirit.enforce_comments || loading.saving }"
                title="Forces teams to leave comments when giving spirit scores of 0 or 4 in any category">
                <div class="checkbox" v-bind:class="{ checked : tournament.settings.spirit.enforce_comments || tournament.settings.spirit.extreme_comments }"
                    tabindex="0" v-on:keyup.space="tournament.settings.spirit.extreme_comments = !tournament.settings.spirit.extreme_comments">
                    <i class="fas fa-square"></i>
                    <i class="fas fa-check-square"></i>
                </div>
                <span class="label">Enforce comments for exceptional scores</span>
            </div>
            <div class="setting spirit-enforce"
                v-on:click="tournament.settings.spirit.enforce_comments = !tournament.settings.spirit.enforce_comments"
                v-bind:class="{ disabled : loading.saving }"
                title="Forces teams to leave comments when giving spirit scores lower/higher than 2 in any category">
                <div class="checkbox" v-bind:class="{ checked : tournament.settings.spirit.enforce_comments }"
                    tabindex="0" v-on:keyup.space="tournament.settings.spirit.enforce_comments = !tournament.settings.spirit.enforce_comments">
                    <i class="fas fa-square"></i>
                    <i class="fas fa-check-square"></i>
                </div>
                <span class="label">Enforce comments for non-average scores</span>
            </div>
        </section>
        <section class="admin-settings">
            <span class="section-title">Admin Settings</span>
            <label for="password">Admin Password</label>
            <input type="password" v-model="tournament.password" v-bind:disabled="loading.saving">
        </section>
        <span class="error-message">{{ error.tournament }}</span>
        <button class="submit action-button"
            v-bind:class="{ saving: loading.saving }"
            v-bind:disabled="!validate() || loading.saving"
            v-on:click="onClickSave" v-if="!save_success">
            {{ loading.saving ? 'Saving...' : 'Save' }}
        </button>
        <button class="submit success action-button ghost-button" v-if="save_success" disabled="disabled">
            <i class="icon fas fa-check"></i><span class="text">Saved Successfully</span>
        </button>
    </div>
</div>
</template>

<script>
export default {
    name: 'TournamentSettings',
    props: ['moniker'],
    data: function() {
        return {
            loading: {
                authenticating: false,
                saving: false
            },
            error: {
                auth:'',
                tournament: ''
            },
            save_success: false,

            tournament: null,

            authenticated: false,
            password: ''
        };
    },
    computed: {
        description: {
            get: function() {
                return decodeURIComponent(this.tournament.settings.description);
            },
            set: function(desc) {
                this.tournament.settings.description = encodeURIComponent(desc);
            }
        }
    },
    mounted: function() {
        this.$refs.input_password.focus();
    },
    methods: {
        onAuthenticate: function() {
            if (!this.password) return;

            this.loading.authenticating = true;
            this.$api.post('/auth/tournament/moniker/' + this.moniker, {
                password: this.password
            }).then((res) => {
                this.tournament = res.data;
                this.authenticated = true;
            }).catch((err) => {
                if (err.response.status === 401)
                    this.error.auth = 'Password incorrect';
                else
                    this.error.auth = 'An unknown error occured';
            }).finally(() => {
                this.loading.authenticating = false;
            });
        },
        validate: function() {
            return this.tournament.name && this.tournament.password;
        },
        onClickSave: function() {
            if (!this.validate()) return;

            if (this.tournament.settings.spirit.enforce_comments)
                this.tournament.settings.spirit.extreme_comments = this.tournament.settings.spirit.enforce_comments;

            this.loading.saving = true;

            this.$api.patch('/tournament/' + this.tournament._id, this.tournament).then((res) => {
                this.tournament = res.data;
                this.save_success = true;
                let watcher = this.$watch(() => JSON.stringify(this.tournament), () => {
                    this.save_success = false;
                    watcher(); // stop watching
                });
            }).catch((err) => {
                this.error.tournament = 'An unknown error occured';
            }).finally(() => {
                this.loading.saving = false;
            });
        }
    }
};
</script>

<style lang="sass">
.TournamentSettings
    display: flex
    height: 100%

    .auth-container
        margin: auto
        display: flex
        flex-flow: column

        padding: 20px
        border-radius: 5px

        background-color: hsl(130, 25%, 90%)
        box-shadow: 5px 5px 45px rgba(0,0,0,0.25)

        label
            margin-bottom: 5px

        .input
            position: relative
            .password
                height: 30px
                width: 250px
                background: var(--background-color)
            .input-submit-button
                position: absolute
                right: 0
                top: 0

        .auth-error
            align-self: center
            color: red
            margin-top: 5px

    // copied from tournament creator
    // TODO: either commonize these two, or make the admin panel different
    // probably latter, include graphs and additional options

    .body
        display: grid
        grid-template-columns: 50% 50%
        grid-template-areas: "title title" "info info" "teams teams" "spirit admin" "err err" "btn btn"
        grid-gap: 10px

        margin: auto
        padding: 20px 0

        width: 100%
        @media only screen and (max-width: 900px)
            grid-template-areas: "title title" "info info" "teams teams" "spirit spirit" "admin admin" "err err" "btn btn"

        .name
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
            &.success
                .icon
                    margin-right: 5px

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
