<template>
<div class="NavigationView" v-bind:class="{ expanded : expanded, hidden : hidden }">
    <button class="mobile-hamburger" v-on:click="expanded = !expanded; $emit('toggleExpand', expanded)">
        <i class="fas fa-bars" v-bind:class="{ hidden: expanded }"></i>
        <i class="fas fa-times" v-bind:class="{ hidden: !expanded }"></i>
    </button>
    <div class="navigation-container">
        <div class="controls">
            <button class="text-button" tabindex="-1"
                v-on:click="$router.go(-1)">
                <i class="icon fas fa-angle-left"></i>
                <span class="text">Back</span>
            </button>
            <button class="text-button home" tabindex="-1"
                v-on:click="$router.push({ name: 'home' })">
                <i class="icon fas fa-home"></i>
                <span class="text">Home</span>
            </button>
        </div>
        <div class="links" v-if="links.length">
            <router-link v-for="(link, idx) in links" v-bind:key="idx"
                v-bind:to="link.to" v-bind:title="link.title"
                tag="button" class="link" tabindex="-1">
                <i class="fas fa-fw" v-bind:class="link.icon"></i>
                <!-- <span class="label">Admin Panel</span> -->
            </router-link>
        </div>
    </div>
</div>
</template>

<script>
// TODO: moving entire page up when expanding, and keeping expansion state without use of store

export default {
    name: 'Navigation',
    data: function() {
        return {
            expanded: false
        };
    },
    computed: {
        // TODO: this works, but ideally we'd want this defined within the components themselves
        // especially so that we can pass params/querycomponents based on the current component
        hidden: function() {
            return this.$route.name === 'home';
        },
        links: function() {
            switch(this.$route.name) {
            case 'tournament':
                return [
                    {
                        title: 'Admin Panel',
                        icon: 'fa-tools',
                        to: {
                            name: 'tournament-settings',
                            params: { moniker: this.$route.params.moniker }
                        }
                    },
                    {
                        title: 'Team Panel',
                        icon: 'fa-users',
                        to: { name: 'home' }
                    }
                ];
            default:
                return [];
            }
        }
    }
};
</script>


<style lang="sass">
.NavigationView
    // padding-left: 5px

    height: 100%
    width: 100%
    z-index: 1

    // TODO: change design of left navigation

    .mobile-hamburger
        display: none
        padding: 10px
        background-color: hsl(153, 16%, 45%)
        border-radius: 3px 0 0 0
        font-size: 1.5em

        height: 40px
        width: 40px

        &:hover
            background-color: hsl(153, 16%, 35%)

    .navigation-container
        height: 100%
        width: 100%

    .controls
        position: absolute
        top: 0
        left: 0
        // margin-top: 5px
        padding: 20px
        font-size: 1.5em

        button
            font-weight: bold
            opacity: 0.5
            .icon
                margin-right: 3px
            &:hover
                opacity: 0.7

            &.home
                display: none

    .links
        height: 100%
        display: flex
        flex-flow: column
        align-items: flex-start
        justify-content: center
        font-weight: bold

        .link
            padding: 10px
            background-color: hsl(153, 16%, 45%)
            border-radius: 0 3px 3px 0
            font-size: 1.5em
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.25)
            // &:first-of-type
            //     border-radius: 0 3px 0 0
            // &:last-of-type
            //     border-radius: 0 0 3px 0
            &:not(:last-of-type)
                margin-bottom: 5px
                // border-bottom: 5px solid hsl(153, 16%, 55%)
            &:hover
                background-color: hsl(153, 16%, 35%)

    @media only screen and (max-width: 900px)
        width: 100%

        box-shadow: -1px -1px 5px rgba(0, 0, 0, 0.25)
        height: 40px
        &.expanded
            // margin-bottom: 0
            .mobile-hamburger
                background-color: hsl(153, 16%, 35%)
                top: 0
                border-radius: 0
                box-shadow: none

        .mobile-hamburger
            display: flex
            position: absolute
            top: -40px
            transition: top 0.25s
            right: 0
            box-shadow: -1px -1px 5px rgba(0, 0, 0, 0.25)

        .navigation-container
            width: 100%
            padding: 0 40px 0 0
            box-sizing: border-box
            display: flex
            justify-content: space-around
            background: hsl(153, 16%, 45%)

            .controls
                position: relative
                padding: 0
                display: flex
                justify-content: center
                align-items: center
                height: 100%
                width: 100%
                button
                    color: var(--white)
                    height: 100%
                    width: 100%
                    opacity: 1
                    border-radius: 0
                    // padding: 0 10px
                    &:hover
                        background-color: hsl(153, 16%, 40%)

                    &.home
                        display: initial

            .links
                flex-flow: row
                width: 100%
                justify-content: space-around
                .link
                    height: 40px
                    width: 100%
                    border-radius: 0
                    box-shadow: none
                    margin-bottom: 0
                    &:hover
                        background-color: hsl(153, 16%, 40%)
</style>
