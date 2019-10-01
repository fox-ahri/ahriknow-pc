<template>
    <div id="book-bookshelf" class="book-bookshelf">
        <div class="box">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>书架</span>
                    <div class="opera">
                        <el-button icon="el-icon-back" @click="goBack"></el-button>
                        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
                    </div>
                </div>
                <span
                    class="book"
                    v-for="i in books.filter(item => !filterText || item.name.includes(filterText))"
                    @click="read(i)"
                >
                    {{ i.name }}&nbsp;--&nbsp;{{ i.date }}
                    <br />
                </span>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    name: "book-bookshelf",
    data() {
        return {
            books: [],
            filterText: "",
            form: ""
        };
    },
    methods: {
        goBack() {
            this.$router.push({ name: this.from });
        },
        read(val) {
            localStorage.setItem("book", JSON.stringify(val));
            this.$router.push({ name: "book-read", params: val });
        }
    },
    mounted() {
        let self = this;
        this.axios
            .get(self.url + "/data/notebook/book/")
            .then(response => {
                if (response.data.code === 200) {
                    self.books = response.data.data;
                    console.log(response.data.data);
                } else {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "服务器内部错误"
                    });
                }
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
#book-bookshelf {
    .box {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
        .opera {
            margin: 10px;
            display: flex;
            button {
                margin-right: 20px;
            }
        }
        .book {
            display: inline-block;
            margin: 6px 40px;
            cursor: pointer;
            &:hover {
                text-decoration: underline;
                color: #888;
            }
        }
    }
}
</style>