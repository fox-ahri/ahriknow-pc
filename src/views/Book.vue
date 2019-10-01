<template>
    <div id="book" class="book">
        <router-view />
    </div>
</template>

<script>
export default {
    name: "book",
    data() {
        return {};
    },
    created() {},
    methods: {},
    mounted() {}
};
</script>

<style lang="scss" scoped>
#book {
    width: 100%;
    height: 100%;
}
</style>