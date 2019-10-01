<template>
    <div id="blog-about" class="blog-about">
        <span class="go-back" @click="goBack">
            <i class="iconfont akback">返回</i>
        </span>
        <br />
        <br />
        <br />
        <div class="article markdown-body" v-html="about"></div>
    </div>
</template>

<script>
export default {
    name: "blog-about",
    data() {
        return {
            about: "",
            from: "home"
        };
    },
    methods: {
        goBack() {
            this.$router.push({ name: this.from });
        }
    },
    mounted() {
        let self = this;
        this.axios
            .get(self.url + "/data/ahriblog/about/")
            .then(response => {
                self.about = response.data.data.content;
            })
            .catch(response => {
                console.log(response);
                self.$message({
                    showClose: true,
                    message: "客户端错误，请求失败"
                });
            });
        this.from = this.$route.params.from || "home";
    }
};
</script>

<style lang="scss" scoped>
#blog-about {
    padding: 50px;
    .go-back {
        color: #3272fc;
        cursor: pointer;
        &:hover {
            color: #0e3fa8;
        }
    }
}
</style>