<template>
    <div id="book-read" class="book-read">
        <aside>
            <div class="title nocopy">{{ book.name }}</div>
            <div class="tree">
                <div class="opera">
                    <el-button icon="el-icon-back" @click="goBack"></el-button>
                    <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
                </div>
                <div class="catalog">
                    <el-tree
                        :data="data"
                        node-key="id"
                        :expand-on-click-node="false"
                        :filter-node-method="filterNode"
                        ref="tree"
                        highlight-current
                        draggable
                        @node-click="read"
                        default-expand-all
                    >
                        <span class="custom-tree-node nocopy" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                        </span>
                    </el-tree>
                    <br />
                </div>
            </div>
        </aside>
        <section>
            <article>
                <div class="doc">Document:&nbsp;&nbsp;{{ document.name }}</div>
                <br />
                <br />
                <div class="content html markdown-body" v-html="document.html"></div>
            </article>
        </section>
    </div>
</template>

<script>
export default {
    name: "book-read",
    data() {
        return {
            book: {
                name: ""
            },
            document: {
                name: "",
                html: ""
            },
            filterText: "",
            data: []
        };
    },
    created() {},
    methods: {
        goBack() {
            this.$router.push({ name: "book-bookshelf" });
        },
        read(data) {
            let self = this;
            this.axios
                .get(self.url + "/data/notebook/document/", {
                    params: {
                        book: self.book._id,
                        _id: data.id
                    }
                })
                .then(response => {
                    if (response.data.code === 200) {
                        self.document = response.data.data;
                        self.document.name = data.label;
                        let tmp = {};
                        for (let i in self.$route.query) {
                            tmp[i] = self.$route.query[i];
                        }
                        tmp.doc = data.id;
                        if (
                            !this.$route.query.hasOwnProperty("doc") ||
                            this.$route.query.doc != data.id
                        ) {
                            self.$router.push({
                                name: "book-read",
                                query: tmp
                            });
                        }
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
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        getById(data, _id) {
            data.forEach(cata => {
                if (cata.id == _id) {
                    this.read(cata);
                    return;
                } else {
                    if (cata.hasOwnProperty("children")) {
                        this.getById(cata.children, _id);
                    }
                }
            });
        }
    },
    mounted() {
        if (this.$route.query.hasOwnProperty("_id")) {
            this.book._id = this.$route.query._id;
            this.book.name = this.$route.query.name;
        } else {
            this.$router.push({ name: "home" });
            return;
        }
        let self = this;
        this.axios
            .get(self.url + "/data/notebook/catalog/", {
                params: {
                    _id: self.book._id
                }
            })
            .then(response => {
                if (response.data.code === 200) {
                    self.data = response.data.data;
                    if (this.$route.query.hasOwnProperty("doc")) {
                        self.getById(self.data, this.$route.query.doc);
                    } else {
                        self.read(self.data[0]);
                    }
                } else if (response.data.code === 400) {
                    self.$message({
                        showClose: true,
                        type: "warning",
                        message: "没有文档"
                    });
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
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    beforeRouteLeave(to, from, next) {
        try {
            localStorage.removeItem("book");
        } catch {}
        next();
    }
};
</script>

<style lang="scss" scoped>
#book-read {
    width: 100%;
    height: 100%;
    background: #fff;
    display: flex;
    aside {
        width: 380px;
        height: 100%;
        box-shadow: #bbb 0 0 8px;
        .title {
            width: 100%;
            height: 80px;
            box-shadow: #ccc 0 0 4px;
            padding: 0 15px;
            line-height: 80px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #2c3e50;
            font-size: 24px;
            font-weight: bold;
        }
        .tree {
            .opera {
                height: 60px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: #eee 0 2px 2px;
                padding: 0 10px;
                button {
                    margin-right: 10px;
                }
            }
            .catalog {
                padding: 10px;
                .custom-tree-node {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 14px;
                    padding-right: 8px;
                }
            }
        }
    }
    section {
        flex: 1;
        height: 100%;
        overflow-y: scroll;
        article {
            padding: 20px 40px;
            margin: 0 auto;
            max-width: 1200px;
            min-height: 100%;
            .doc {
                padding: 15px;
                font-size: 24px;
                color: #2c3e50;
                box-shadow: #ccc 0 0 6px;
            }
            .content {
                padding: 15px;
                box-shadow: #ccc 0 0 6px;
            }
        }
    }
}
</style>