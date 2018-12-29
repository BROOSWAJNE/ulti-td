<template>
<div class="NavigationView">
    <div class="controls">
        <button class="text-button" tabindex="-1"
            v-on:click="$router.go(-1)">
            <i class="icon fas fa-angle-left"></i>
            <span class="text">Back</span>
        </button>
    </div>
    <div class="links">
        <router-link v-for="(link, idx) in settings.links" v-bind:key="idx"
            v-bind:to="link.to" v-bind:title="link.title"
            tag="button" class="link">
            <i class="fas fa-fw" v-bind:class="link.icon"></i>
            <!-- <span class="label">Admin Panel</span> -->
        </router-link>
    </div>
</div>
</template>

<script>
export default {
    name: 'Navigation',
    props: ['settings']
};
</script>


<style lang="sass">
.NavigationView
    position: absolute
    top: 0
    left: 0
    // padding-left: 5px

    height: 100vh
    width: 10vw
    z-index: 1
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
</style>
