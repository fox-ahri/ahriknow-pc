<template>
    <div id="blog-home" class="blog-home">
        <div v-for="i in article" class="article">
            <hr style="height:2px;border:none;border-top:2px dashed #aaa;" />
            <div class="name">
                {{ i.name }}
                <span>作者:{{ i.username }}&nbsp;&nbsp;时间：{{ i.date }}</span>
            </div>
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
            this.$router.push({
                name: "blog-read",
                query: { art: val._id, cate: val.category }
            });
        }
    },
    mounted() {
        let self = this;
        this.axios
            .get(self.url + "/data/ahriblog/get_by_condition/", {
                params: {
                    limit: 5
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
#blog-home {
    width: 100%;
    height: 100%;
    .article {
        padding: 15px 30px;
        margin: 10px 40px;
        transition: .6s;
        &:hover {
            background: rgb(245, 250, 250);
        }
        // box-shadow: #ccc 0 0 4px;
        .name {
            font-size: 22px;
            font-weight: bold;
            padding: 5px 15px;
            span {
                font-size: 16px;
                margin-left: 40px;
            }
        }
        .html {
            min-height: 40px;
            max-height: 140px;
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
                    border-radius: 8px;
                }
            }
        }
    }
}
</style>