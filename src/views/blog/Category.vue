<template>
    <div id="blog-category" class="blog-category">
        <div class="categories">
            <h1>分类:</h1>
            <br />
            <h3>投稿</h3>
            <div
                v-for="i in category"
                v-if="i.contribute == '投稿'"
                class="category"
                @click="readByCate(i)"
            >{{ i.name }}&nbsp;--&nbsp;{{ i.username }}&nbsp;--&nbsp;{{ i.date }}&nbsp;--&nbsp;文章数：{{ i.count }}</div>
            <br />
            <br />
            <h3>其他</h3>
            <div
                v-for="i in category"
                v-if="i.contribute == '普通'"
                class="category"
                @click="readByCate(i)"
            >{{ i.name }}&nbsp;--&nbsp;{{ i.username }}&nbsp;--&nbsp;{{ i.date }}&nbsp;--&nbsp;文章数：{{ i.count }}</div>
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
    methods: {
        readByCate(val) {
            if (val.count == 0) {
                this.$message({
                    showClose: true,
                    message: "该分类没有文章",
                    type: "warning"
                });
                return;
            }
            this.$router.push({
                name: "blog-read",
                params: { from: "blog-category" },
                query: { cate: val._id }
            });
        }
    },
    mounted() {
        let self = this;
        this.axios
            .get(self.url + "/data/ahriblog/list_categories/")
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