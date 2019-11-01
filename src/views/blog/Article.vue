<template>
    <div id="blog-article" class="blog-article">
        <div class="articles">
            <h1>文章:</h1>
            <br />
            <div
                v-for="i in article"
                class="article"
                @click="read(i)"
            >{{ i.name }}&nbsp;--&nbsp;{{ i.username }}&nbsp;--&nbsp;{{ i.date }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "blog-article",
    data() {
        return {
            article: []
        };
    },
    created() {},
    methods: {
        read(val) {
            this.$router.push({
                name: "blog-read",
                params: { from: "blog-article" },
                query: { art: val._id, cate: val.category }
            });
        }
    },
    mounted() {
        let self = this;
        this.axios
            .get(self.url + "/data/ahriblog/list_articles/")
            .then(response => {
                self.article = response.data.data;
            })
            .catch(response => {
                console.log(response);
            });
    }
};
</script>

<style lang="scss" scoped>
#blog-article {
    .articles {
        padding: 60px 100px;
        .article {
            margin: 10px 40px;
            cursor: pointer;
            transition: 0.2s;
            &:hover {
                color: #888;
                text-decoration: underline;
            }
        }
    }
}
</style>