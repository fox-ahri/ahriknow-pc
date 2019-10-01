<template>
    <div id="blog-category" class="blog-category">
        <div class="categories">
            <h1>分类:</h1>
            <br />
            <div
                v-for="i in category"
                class="category"
                @click="readByCate(i)"
            >{{ i.name }}&nbsp;--&nbsp;{{ i.username }}&nbsp;--&nbsp;{{ i.date }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "blog-category",
    data() {
        return {
            category: []
        };
    },
    created() {},
    methods: {
        readByCate(val) {
            localStorage.setItem("cate", val._id);
            this.$router.push({
                name: "blog-read",
                params: { cate: val._id, from: "blog-category" }
            });
        }
    },
    mounted() {
        let self = this;
        this.axios
            .get(self.url + "/data/ahriblog/categories/")
            .then(response => {
                self.category = response.data.data;
            })
            .catch(response => {
                console.log(response);
            });
    }
};
</script>

<style lang="scss" scoped>
#blog-category {
    .categories {
        padding: 60px 100px;
        .category {
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