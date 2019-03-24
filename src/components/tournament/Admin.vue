<template>
<div class="TournamentSettings">
    <div class="auth-container" v-if="!authenticated">
        <label for="password">Admin Password</label>
        <div class="input">
            <input type="password" class="input password has-submit" v-model="password"
                v-on:keyup.exact="error.auth = ''" ref="input_password"
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
        <span class="name">{{ tournament.name ? tournament.name : 'Unnamed Tournament' }}</span>

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
                v-on:click="tournament.settings.spirit.comments.extreme = !tournament.settings.spirit.comments.extreme"
                v-bind:class="{ disabled : tournament.settings.spirit.comments.enforce || loading.saving }"
                title="Forces teams to leave comments when giving spirit scores of 0 or 4 in any category">
                <div class="checkbox" v-bind:class="{ checked : tournament.settings.spirit.comments.enforce || tournament.settings.spirit.comments.extreme }"
                    tabindex="0" v-on:keyup.space="tournament.settings.spirit.comments.extreme = !tournament.settings.spirit.comments.extreme">
                    <i class="fas fa-square"></i>
                    <i class="fas fa-check-square"></i>
                </div>
                <span class="label">Enforce comments for exceptional scores</span>
            </div>
            <div class="setting spirit-enforce"
                v-on:click="tournament.settings.spirit.comments.enforce = !tournament.settings.spirit.comments.enforce"
                v-bind:class="{ disabled : loading.saving }"
                title="Forces teams to leave comments when giving spirit scores lower/higher than 2 in any category">
                <div class="checkbox" v-bind:class="{ checked : tournament.settings.spirit.comments.enforce }"
                    tabindex="0" v-on:keyup.space="tournament.settings.spirit.comments.enforce = !tournament.settings.spirit.comments.enforce">
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
        <section class="team-settings">
            <span class="section-title">Team Settings</span>
        </section>
        <section class="team-invites">
            <span class="section-title">Team Invites <span class="count">({{ tournament.invites.length }})</span></span>
            <span class="section-description">
                Inviting a team will provide you a unique link which you can send to the team's captain to allow them
                to register for your tournament, so that they can access score/spirit submissions and other features.
            </span>
            <div class="invite-list">
                <div class="invite" v-for="invite in tournament.invites" v-bind:key="invite.name">
                    <span class="invite-name" :title="invite.name">{{ invite.name }}</span>
                    <span class="invite-status">{{ invite.team ? 'Accepted' : 'Pending' }}</span>
                    <button class="invite-link invite-link-copy" title="Copy invite link">
                        <div class="fa-combiner">
                            <i class="fas fa-fw fa-link"></i>
                            <i class="subscript far fa-fw fa-copy"></i>
                        </div>
                    </button>
                    <button class="invite-link invite-link-view" :title="(inviteLinksExpanded[invite.name] ? 'Hide' : 'View') + ' invite link'"
                        v-on:click="$set(inviteLinksExpanded, invite.name, !inviteLinksExpanded[invite.name])"
                        v-bind:class="{ expanded: inviteLinksExpanded[invite.name] }">
                        <div class="fa-combiner">
                            <i class="fas fa-fw fa-link"></i>
                            <i class="subscript far fa-fw fa-eye"></i>
                            <i class="subscript far fa-fw fa-eye-slash"></i>
                        </div>
                    </button>
                    <pre class="invite-link" v-bind:class="{ expanded : inviteLinksExpanded[invite.name] }">blah</pre>
                    <button class="delete" title="Remove team invite" v-on:click="onRemoveInvite(invite)">
                        <i class="fas fa-fw fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="new-invite input">
                <input type="text" placeholder="Team Name" class="team-name has-submit"
                    v-model="newInvite.name" v-on:keyup.enter.stop="onAddInvite" :class="{ invalid: newInvite.invalid }"
                    @keyup.="$set(newInvite, 'invalid', false)">
                <button class="input-submit-button" v-on:click="onAddInvite"><i class="fas fa-plus"></i></button>
            </div>
        </section>
        <span class="error-message">{{ error.tournament }}</span>
        <button class="submit action-button"
            v-bind:class="{ saving: loading.saving }"
            v-bind:disabled="!validate() || loading.saving"
            v-on:click="onClickSave" v-if="!saveSuccess">
            {{ loading.saving ? 'Saving...' : 'Save' }}
        </button>
        <button class="submit success action-button ghost-button" v-if="saveSuccess" disabled="disabled">
            <i class="icon fas fa-check"></i><span class="text">Saved Successfully</span>
        </button>
    </div>
</div>
</template>

<script>
const _ = require('lodash');

export default {
    name: 'TournamentSettings',
    props: ['moniker'],
    data: function() {
        return {
            loading: {
                authenticating: false,
                saving: false,
            },
            error: {
                auth:'',
                tournament: '',
            },
            saveSuccess: false,

            tournament: null,
            newInvite: {
                name: '',
            },
            inviteLinksExpanded: {},

            authenticated: false,
            password: '',
        };
    },
    computed: {
        description: {
            get: function() {
                return decodeURIComponent(this.tournament.settings.description);
            },
            set: function(desc) {
                this.tournament.settings.description = encodeURIComponent(desc);
            },
        },
    },
    mounted: function() {
        this.$refs.input_password.focus();
    },
    methods: {
        onAuthenticate: function() {
            if (!this.password) return;

            this.loading.authenticating = true;
            this.$api.post('/auth/tournament/moniker/' + this.moniker, {
                password: this.password,
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

            if (this.tournament.settings.spirit.comments.enforce)
                this.tournament.settings.spirit.comments.extreme = this.tournament.settings.spirit.comments.enforce;

            this.loading.saving = true;

            this.$api.patch('/tournament/' + this.tournament._id, this.tournament).then((res) => {
                this.tournament = res.data;
                this.saveSuccess = true;
                let watcher = this.$watch(() => JSON.stringify(this.tournament), () => {
                    this.saveSuccess = false;
                    watcher(); // stop watching
                });
            }).catch((err) => {
                this.error.tournament = 'An unknown error occured';
            }).finally(() => {
                this.loading.saving = false;
            });
        },
        onAddInvite: function() {
            let existing = _.find(this.tournament.invites, invite => invite.name === this.newInvite.name);
            if (existing) {
                this.$set(this.newInvite, 'invalid', true);
            } else {
                this.tournament.invites.push({
                    name: this.newInvite.name,
                });
                this.newInvite.name = '';
            }
        },
        onRemoveInvite: function(invite) {
            this.tournament.invites.splice(this.tournament.invites.indexOf(invite), 1);
        },
    },
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

    .body
        display: grid
        grid-template-columns: 50% 50%
        grid-template-areas: "title title" "info info" "teams invites" "spirit invites" "admin invites" "err err" "btn btn"
        grid-gap: 10px

        margin: auto
        padding: 20px 0

        width: 100%
        @media only screen and (max-width: 900px)
            grid-template-areas: "title title" "info info" "teams teams" "invites invites" "spirit spirit" "admin admin" "err err" "btn btn"

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
            .count
                font-weight: normal
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
                margin-right: auto
                &.disabled
                    pointer-events: none
                    opacity: 0.5

        .admin-settings
            grid-area: admin

        .team-settings
            grid-area: teams

        .team-invites
            grid-area: invites
            display: grid
            grid-template-rows: auto auto minmax(auto, 1fr) auto
            max-height: 300px
            .invite-list
                overflow: auto
                margin-bottom: 10px
                border-radius: 3px
            .invite
                display: grid
                grid-template-columns: 1fr 50px auto auto auto auto
                grid-template-rows: 25px

                &:not(:last-of-type)
                    margin-bottom: 5px
                overflow: hidden

                background: hsla(150, 16%, 85%, 1)
                border-radius: 3px
                font-size: 10px

                >*
                    display: flex
                    align-items: center
                    padding: 0 6px
                .invite-name, pre.invite-link
                    overflow: hidden
                    white-space: nowrap
                    padding: 0 0 0 6px
                    margin-right: 6px
                .invite-status
                    font-family: monospace
                    background: hsla(150, 16%, 80%, 1)
                button
                    color: var(--text-color)
                    border-radius: 0
                    background: hsla(150, 16%, 80%, 1)
                    .fa-combiner
                        --shadow-color: hsla(150, 16%, 80%, 1)
                    &:hover
                        background: hsla(150, 16%, 75%, 1)
                        .fa-combiner
                            --shadow-color: hsla(150, 16%, 75%, 1)
                    &.invite-link
                        .fa-combiner .subscript.fa-eye-slash
                            display: none
                        &.expanded .fa-combiner .subscript
                            &.fa-eye
                                display: none
                            &.fa-eye-slash
                                display: inline-block
                pre.invite-link
                    user-select: all
                    margin: 0
                    width: 200px
                    box-sizing: border-box
                    transition: margin-right 0.5s
                    margin-right: -200px
                    &.expanded
                        margin-right: 0
            .new-invite
                position: relative
                height: 30px
                .team-name
                    height: 30px
                    width: 100%
                .input-submit-button
                    position: absolute
                    top: 0
                    right: 0

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
