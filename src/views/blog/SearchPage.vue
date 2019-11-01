<template>
    <div id="blog-search" class="blog-search">
        <el-input placeholder="请输入内容" v-model="input" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <div class="result" v-show="article.length != 0 || category.length != 0">
            <div class="left">
                <div class="title">文章：</div>
                <div
                    class="item"
                    v-for="i in article"
                    @click="read(i)"
                >{{ i.name }}&nbsp;--&nbsp;{{ i.date }}</div>
            </div>
            <div class="right">
                <div class="title">分类：</div>
                <div
                    class="item"
                    v-for="i in category"
                    v-if="i.name != '站点信息'"
                    @click="readByCate(i)"
                >{{ i.name }}&nbsp;--&nbsp;{{ i.date }}&nbsp;--&nbsp;文章数：{{ i.count }}</div>
            </div>
        </div>
        <div class="tip" v-show="article.length == 0 && category.length == 0">没有数据</div>
    </div>
</template>

<script>
export default {
    name: "blog-search",
    data() {
        return {
            input: "",
            article: [],
            category: []
        };
    },
    created() {},
    methods: {
        read(val) {
            this.$router.push({
                name: "blog-read",
                params: { from: "blog-search" },
                query: { art: val._id, cate: val.category }
            });
        },
        readByCate(val) {
            this.$router.push({
                name: "blog-read",
                params: { from: "blog-search" },
                query: { cate: val._id }
            });
        },
        search() {
            let self = this;
            this.axios
                .get(self.url + "/data/ahriblog/search/", {
                    params: {
                        search: self.input
                    }
                })
                .then(response => {
                    self.article = response.data.data.article;
                    self.category = response.data.data.category;
                })
                .catch(response => {
                    console.log(response);
                });
        }
    },
    mounted() {
        this.search();
    }
};
</script>

<style lang="scss" scoped>
#blog-search {
    width: 100%;
    height: 100%;
    padding: 50px 60px;
    .el-select .el-input {
        width: 130px;
    }
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
    .result {
        padding: 20px 20px;
        display: flex;
        justify-content: space-between;
        div {
            width: 50%;
            .title {
                font-size: 20px;
                color: #666;
            }
            .item {
                padding: 4px 0 0 24px;
                white-space: nowrap;
                cursor: pointer;
                &:hover {
                    color: #888;
                    text-decoration: underline;
                }
            }
        }
    }
    .tip {
        width: 100%;
        text-align: center;
        font-size: 32px;
        color: #2c3e50;
        padding: 30px;
    }
}
</style>