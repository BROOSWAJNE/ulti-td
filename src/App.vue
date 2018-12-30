<template>
<div id="App" v-bind:class="{ 'nav-expanded': nav_expanded }">
    <NavigationView @toggleExpand="(expanded) => nav_expanded = expanded"></NavigationView>
    <div class="app-body">
        <router-view></router-view>
    </div>
</div>
</template>

<script>
import NavigationView from './components/common/Navigation';

export default {
    name: 'App',
    components: {
        NavigationView
    },
    data: function() {
        return { nav_expanded: false };
    }
};
</script>

<style lang="sass">
@import "../styles/variables"
@import "../styles/mixins"

html
    height: 100%
    width: 100%

body
    font-family: 'PT Sans', sans-serif
    font-size: 12px

    height: 100%
    width: 100%

    overflow: hidden

    color: var(--text-color)
    background-color: var(--background-color)

#App
    height: 100%
    width: 100%
    // overflow: auto
    overflow: hidden

    display: grid
    grid-template-columns: 10vw 90vw
    grid-template-rows: auto 40px
    grid-template-areas: "nav body body" ". . ."
    .NavigationView
        grid-area: nav
    .app-body
        grid-area: body
        height: 100vh
        padding-right: 10vw
        overflow: auto
        margin-top: 0
        transition: margin-top 0.25s

    @media only screen and (max-width: 900px)
        display: grid
        grid-template-columns: 100%
        grid-template-areas: "body" "nav"
        .NavigationView
            position: relative
        .app-body
            padding: 0 20px
            overflow: auto
        &.nav-expanded
            .app-body
                margin-top: -40px
</style>
