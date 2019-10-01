<template>
    <div id="blog-home" class="blog-home">
        <div v-for="i in article" class="article">
            <div class="name">{{ i.name }}</div>
            <hr style="height:2px;border:none;border-top:2px dashed #aaa;" />
            <div class="html" v-html="i.html"></div>
            <div class="btn">
                <button @click="read(i)">阅读全文</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "blog-home",
    data() {
        return {
            article: [],
            category: []
        };
    },
    created() {},
    methods: {
        read(val) {
            localStorage.setItem("article", JSON.stringify(val));
            this.$router.push({ name: "blog-read", params: val });
        }
    },
    mounted() {
        let self = this;
        this.axios
            .get(self.url + "/data/ahriblog/article/")
            .then(response => {
                self.article = response.data.data[0];
                self.category = response.data.data[1];
            })
            .catch(response => {
                console.log(response);
            });
    }
};
</script>

<style lang="scss" scoped>
#blog-home {
    width: 100%;
    height: 100%;
    .article {
        padding: 15px 30px;
        margin: 30px 40px;
        box-shadow: #ccc 0 0 4px;
        .name {
            font-size: 24px;
            font-weight: bold;
        }
        .html {
            height: 140px;
            padding: 10px 60px;
            overflow: hidden;
        }
        .btn {
            text-align: center;
            padding-top: 35px;
            button {
                width: 120px;
                height: 40px;
                background: none;
                border: #222 solid 3px;
                cursor: pointer;
                transition: 0.2s;
                &:hover {
                    background: #eee;
                    border-color: #444;
                }
            }
        }
    }
}
</style>