<template>
<div id="App">
    <NavigationView></NavigationView>
    <router-view />
</div>
</template>

<script>
import NavigationView from './components/common/Navigation';

export default {
    name: 'App',
    components: {
        NavigationView
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
</style>
