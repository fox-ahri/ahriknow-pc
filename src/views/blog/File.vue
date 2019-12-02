<template>
    <div id="blog-file" class="blog-file">
        <div class="file">
            <h1>归档:</h1>
            <br />
            <el-timeline>
                <el-timeline-item v-for="i in data" :timestamp="i.date" placement="top">
                    <el-card>
                        <div class="article" v-for="j in i.allData" @click="read(j)">
                            {{ j.name }}&nbsp;--&nbsp;{{ j.username }}
                            <span
                                v-if="j.date.length > 12"
                            >&nbsp;--&nbsp;{{ j.date.substring(11, 16) }}</span>
                        </div>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>

<script>
export default {
    name: "blog-file",
    data() {
        return {
            data: []
        };
    },
    created() {},
    methods: {
        read(val) {
            this.$router.push({
                name: "blog-read",
                params: { from: "blog-file" },
                query: { art: val._id, cate: val.category }
            });
        },
        classificate(article) {
            let data = this.sort_pro(article, "date");
            data.sort((a, b) => {
                return a.date > b.date ? -1 : 1;
            });
            this.data = data;
        },
        sort_pro(data, name) {
            let c = [];
            let d = {};
            data.forEach(element => {
                if (!d[element[name].substr(0, 10)]) {
                    c.push({
                        [name]: element[name].substr(0, 10),
                        allData: [element]
                    });
                    d[element[name].substr(0, 10)] = element;
                } else {
                    c.forEach(ele => {
                        if (
                            ele[name].substr(0, 10) ==
                            element[name].substr(0, 10)
                        ) {
                            ele.allData.push(element);
                        }
                    });
                }
            });
            return c;
        }
    },
    mounted() {
        let self = this;
        this.axios
            .get(self.url + "/data/ahriblog/list_articles/")
            .then(response => {
                self.classificate(response.data.data);
            })
            .catch(response => {
                console.log(response);
            });
    }
};
</script>

<style lang="scss" scoped>
#blog-file {
    .file {
        padding: 60px 100px;
        .article {
            margin: 10px;
            font-size: 16px;
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