<template>
    <div id="blog-read" class="blog-read">
        <div class="back">
            <button @click="goBack">
                <i class="iconfont akback"></i>
            </button>&nbsp;&nbsp;&nbsp;&nbsp;
            <button @click="drawer = true">目录</button>
        </div>
        <header>
            <div class="title">{{ article.name }}</div>
            <div class="info">{{ article.username }}&nbsp;&nbsp;&nbsp;&nbsp;{{ article.date }}</div>
        </header>
        <hr style="height:2px;border:none;border-top:2px dashed #aaa;" />
        <div class="article markdown-body" v-html="article.html"></div>
        <span class="go-back" @click="goBack">
            <i class="iconfont akback">返回</i>
        </span>
        <el-drawer title="文章列表" :visible.sync="drawer" direction="rtl">
            <div class="art-list" style="padding: 0 50px;">
                <div
                    v-for="i in art_list"
                    style="white-space: nowrap;overflow: hidden;cursor: pointer;padding: 4px;color: #333"
                    @click="read(i)"
                    @mouseenter="over($event, 1)"
                    @mouseleave="over($event, 2)"
                >{{ i.name }}</div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
export default {
    name: "blog-read",
    data() {
        return {
            article: {},
            cate: "",
            art_list: [],
            from: "",
            drawer: false
        };
    },
    created() {},
    methods: {
        read(val) {
            localStorage.setItem("article", JSON.stringify(val));
            this.article = val;
            this.drawer = false;
        },
        goBack() {
            this.$router.push({ name: this.from });
        },
        over(e, o) {
            if (o == 1) e.target.style.color = "#888";
            else e.target.style.color = "#333";
        }
    },
    mounted() {
        if (this.$route.params.hasOwnProperty("_id")) {
            this.article = this.$route.params;
            this.cate = this.article.category;
        } else {
            if (localStorage.getItem("article")) {
                this.article = JSON.parse(localStorage.getItem("article"));
                this.cate = this.article.category;
            }
        }
        if (this.$route.params.hasOwnProperty("cate")) {
            this.cate = this.$route.params.cate;
        } else {
            if (localStorage.getItem("cate")) {
                this.cate = localStorage.getItem("cate");
            }
        }
        let self = this;
        this.axios
            .get(self.url + "/data/ahriblog/article/", {
                params: {
                    category: self.cate
                }
            })
            .then(response => {
                self.art_list = response.data.data;
                self.loading = false;
                if (
                    self.$route.params.hasOwnProperty("cate") ||
                    localStorage.getItem("cate")
                ) {
                    self.article = self.art_list[0];
                }
                self.loading2 = false;
            })
            .catch(response => {
                console.log(response);
                self.$message({
                    showClose: true,
                    message: "客户端错误，请求失败"
                });
                self.loading = false;
            });
        this.from = this.$route.params.from || "home";
    },
    beforeRouteLeave(to, from, next) {
        try {
            localStorage.removeItem("article");
            localStorage.removeItem("cate");
        } catch {}
        next();
    }
};
</script>

<style lang="scss" scoped>
#blog-read {
    padding: 15px;
    .go-back {
        color: #3272fc;
        cursor: pointer;
        &:hover {
            color: #0e3fa8;
        }
    }
    .back {
        padding: 40px 0 10px 30px;
        button {
            background: none;
            width: 60px;
            height: 40px;
            border: #ccc solid 1px;
            border-radius: 4px;
            cursor: pointer;
            transition: 0.2s;
            &:hover {
                box-shadow: inset #ccc 0 0 6px;
            }
        }
    }
    header {
        padding: 0 0 15px 40px;
        display: flex;
        .title {
            font-size: 24px;
            font-weight: bold;
            margin: 15px 40px 0 10px;
        }
        .info {
            font-size: 18px;
            line-height: 40px;
            margin: 15px 40px 0 10px;
        }
    }
    .article {
        padding: 30px 50px;
    }
}
</style>