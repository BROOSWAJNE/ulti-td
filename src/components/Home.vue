<template>
<div class="Home">
    <div class="title">Ulti.TD</div>
    <div class="action new">
        <button class="button action-button"
            v-on:click="expandInput('new')">
            New Tournament
        </button>
        <div class="input" v-bind:class="{ expanded : expanded.new }">
            <input type="text" class="input name has-submit"
                placeholder="Tournament Name"
                v-bind:disabled="!expanded.new"
                v-model="inputs.new" ref="input_new"
                v-on:keyup.enter="onCreateNewTournament">
            <button class="input-submit-button"
                v-on:click="onCreateNewTournament"
                v-bind:class="{ hidden: !inputs.new }">
                <i class="fas fa-caret-right"></i>
            </button>
        </div>
    </div>
    <div class="action find">
        <button class="button action-button ghost-button"
            v-on:click="expandInput('find')">
            Find Tournament
        </button>
        <div class="input" v-bind:class="{ expanded : expanded.find }">
            <input type="text" class="input name has-submit"
                placeholder="Tournament Name"
                v-bind:disabled="!expanded.find"
                v-model="inputs.find" ref="input_find"
                v-on:keyup.enter="onFindTournament">
            <button class="input-submit-button"
                v-on:click="onFindTournament"
                v-bind:class="{ hidden: !inputs.find }">
                <i class="fas fa-caret-right"></i>
            </button>
        </div>
    </div>
    <div class="action list">
        <router-link tag="button" class="button action-button ghost-button"
            v-bind:to="{ name: 'tournament-list' }">
            All Tournaments
        </router-link>
    </div>
</div>
</template>

<script>
export default {
    name: 'Home',
    data: function() {
        return {
            expanded: {
                new: false,
                find: false,
            },
            inputs: {
                new: '',
                find: '',
            },
        };
    },
    methods: {
        onCreateNewTournament() {
            if (!this.inputs.new) return;
            this.$router.push({
                name: 'tournament-creator',
                query: { name: this.inputs.new },
            });
        },
        onFindTournament() {
            // TODO: fetch tournaments by name and list instead
            if (!this.inputs.find) return;
            this.$router.push({
                name: 'tournament',
                params: { moniker: this.inputs.find },
            });
        },
        expandInput(input) {
            this.expanded[input] = !this.expanded[input];
            setTimeout(() => {
                this.expanded[input] ? this.$refs['input_'+input].focus() : this.$refs['input_'+input].blur();
            }, 0);
        },
    },
};
</script>

<style lang="sass">

.Home
    display: flex
    align-items: center
    justify-content: center
    flex-flow: column

    height: 100%
    width: 100%

    .title
        font-size: 10em
        font-weight: bold

    .action
        margin-bottom: 10px
        display: grid
        grid-template-rows: auto auto

        .button, .name
            width: 220px

        .button
            height: 60px
            z-index: 1
        .input
            height: 30px
            position: relative

            display: flex
            align-items: flex-end

            .input-submit-button
                position: absolute
                right: 0

            margin-top: -30px
            transition: margin-top 0.25s
            &.expanded
                margin-top: 10px
</style>
