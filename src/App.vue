<template>
<div id="App" v-bind:class="{ 'nav-expanded': navExpanded }">
    <NavigationView @toggleExpand="(expanded) => navExpanded = expanded"></NavigationView>
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
        NavigationView,
    },
    data: function() {
        return { navExpanded: false };
    },
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
    grid-template-areas: "nav body"
    .NavigationView
        grid-area: nav
        transition: margin-bottom 0.25s
        margin-bottom: -40px
    .app-body
        grid-area: body
        padding-right: 10vw
        overflow: auto
        margin-top: 0

    @media only screen and (max-width: 900px)
        display: grid
        grid-template-columns: 100%
        grid-template-rows: 1fr auto
        grid-template-areas: "body" "nav"
        .NavigationView
            position: relative
        .app-body
            padding: 0 20px 40px 20px
            overflow: auto
        &.nav-expanded
            .NavigationView
                margin-bottom: 0
</style>
