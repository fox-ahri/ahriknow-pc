<template>
    <div id="blog-collection" class="blog-collection">
        <div class="articles">
            <h1>我的收藏:</h1>
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
    name: "blog-collection",
    data() {
        return {
            article: [],
            user: {
                role: 0
            }
        };
    },
    created() {},
    methods: {
        read(val) {
            this.$router.push({
                name: "blog-read",
                params: { from: "blog-collection" },
                query: { art: val._id, cate: val.category }
            });
        }
    },
    mounted() {
        if (this.$store.state.user != null) {
            this.user = this.$store.state.user;
        } else {
            this.user = {
                role: 0
            };
        }
        let self = this;
        this.axios
            .get(self.url + "/data/ahriblog/collection/", {
                params: {
                    user_id: self.user._id
                }
            })
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
#blog-collection {
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